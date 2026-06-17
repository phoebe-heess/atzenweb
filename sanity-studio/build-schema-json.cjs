// Local, network-free schema extraction.
// Bundles schemaTypes/index.ts via esbuild, builds an in-memory Schema with
// @sanity/schema's createSchema (pure, no network), then re-implements the
// exact serialization used by `sanity manifest extract`
// (node_modules/sanity/lib/_internal/cli/threads/extractManifest.js) so the
// resulting JSON matches what the official CLI would have produced — we
// just skip the CLI's network-bound bootstrap (auth/project validation),
// which is unreachable from this sandbox.
const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')
const startCase = require('lodash/startCase')

const entry = path.join(__dirname, 'schemaTypes', 'index.ts')
const outfile = path.join(__dirname, '.schemaTypes.bundle.cjs')

esbuild.buildSync({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile,
  external: ['sanity', '@sanity/*', 'react', 'react-dom'],
})

const {schemaTypes} = require(outfile)
const sanity = require('sanity')

const schema = sanity.createSchema({name: 'default', types: schemaTypes})

// ---- verbatim helper logic from extractManifest.js ----

function isType(schemaType, typeName) {
  return schemaType.name === typeName ? true : schemaType.type ? isType(schemaType.type, typeName) : false
}
function isReference(type) { return isType(type, 'reference') }
function isCrossDatasetReference(type) { return isType(type, 'crossDatasetReference') }
function isGlobalDocumentReference(type) { return isType(type, 'globalDocumentReference') }
function isObjectField(v) { return typeof v === 'object' && v !== null && 'name' in v }
function isDefined(v) { return v != null }
function isRecord(v) { return !!v && typeof v === 'object' }
function isString(v) { return typeof v === 'string' }
function isPrimitive(v) { return isString(v) || typeof v === 'boolean' || typeof v === 'number' }
function getSchemaTypeInternalOwnProps(type) { return type && type._internal_ownProps }
function getDefinedTypeName(type) { return getSchemaTypeInternalOwnProps(type)?.type }

const DEFAULT_IMAGE_FIELDS = ['asset', 'hotspot', 'crop', 'media']
const DEFAULT_FILE_FIELDS = ['asset', 'media']
const DEFAULT_GEOPOINT_FIELDS = ['lat', 'lng', 'alt']
const DEFAULT_SLUG_FIELDS = ['current', 'source']

function getCustomFields(type) {
  const fields = type.fieldsets
    ? type.fieldsets.flatMap((fs) => (fs.single ? fs.field : fs.fields.map((field) => ({...field, fieldset: fs.name}))))
    : type.fields
  return isType(type, 'block') ? []
    : isType(type, 'slug') ? fields.filter((f) => !DEFAULT_SLUG_FIELDS.includes(f.name))
    : isType(type, 'geopoint') ? fields.filter((f) => !DEFAULT_GEOPOINT_FIELDS.includes(f.name))
    : isType(type, 'image') ? fields.filter((f) => !DEFAULT_IMAGE_FIELDS.includes(f.name))
    : isType(type, 'file') ? fields.filter((f) => !DEFAULT_FILE_FIELDS.includes(f.name))
    : fields
}

function isCustomized(maybeCustomized) {
  const internalOwnProps = getSchemaTypeInternalOwnProps(maybeCustomized)
  return isObjectField(maybeCustomized) && !isReference(maybeCustomized) && !isCrossDatasetReference(maybeCustomized) &&
    !isGlobalDocumentReference(maybeCustomized) && 'fields' in maybeCustomized && Array.isArray(maybeCustomized.fields) &&
    (internalOwnProps?.fields ? !!getCustomFields(maybeCustomized).length : false)
}

const MAX_CUSTOM_PROPERTY_DEPTH = 5

function retainSerializableProps(maybeSerializable, depth = 0) {
  if (!(depth > MAX_CUSTOM_PROPERTY_DEPTH) && isDefined(maybeSerializable)) {
    if (isPrimitive(maybeSerializable)) return maybeSerializable === '' ? undefined : maybeSerializable
    if (maybeSerializable instanceof RegExp) return maybeSerializable.toString()
    if (Array.isArray(maybeSerializable)) {
      const items = maybeSerializable.map((item) => retainSerializableProps(item, depth + 1)).filter(isDefined)
      return items.length ? items : undefined
    }
    if (isRecord(maybeSerializable)) {
      const entries = Object.entries(maybeSerializable)
        .map(([k, v]) => [k, retainSerializableProps(v, depth + 1)])
        .filter(([, v]) => isDefined(v))
      return entries.length ? Object.fromEntries(entries) : undefined
    }
  }
  return undefined
}

function retainCustomTypeProps(type) {
  const manuallySerializedFields = [
    'name', 'title', 'description', 'readOnly', 'hidden', 'validation', 'fieldsets', 'fields', 'to', 'of',
    'type', 'jsonType', '__experimental_actions', '__experimental_formPreviewTitle',
    '__experimental_omnisearch_visibility', '__experimental_search', 'components', 'icon', 'orderings',
    'preview', 'groups', 'group',
  ]
  const filtered = Object.fromEntries(Object.entries(type).filter(([key]) => !manuallySerializedFields.includes(key)))
  return retainSerializableProps(filtered)
}

function ensureString(key, value) { return typeof value === 'string' ? {[key]: value} : {} }
function ensureConditional(key, value) {
  return typeof value === 'boolean' ? {[key]: value} : typeof value === 'function' ? {[key]: 'conditional'} : {}
}
function ensureCustomTitle(typeName, value) {
  const titleObject = ensureString('title', value)
  const defaultTitle = startCase(typeName)
  return titleObject.title === defaultTitle ? {} : titleObject
}

const disallowedConstraintTypes = [sanity.ConcreteRuleClass.FIELD_REF]
const validationRuleTransformers = {
  type: (rule) => ({...rule, constraint: 'constraint' in rule && (typeof rule.constraint === 'string' ? rule.constraint.toLowerCase() : retainSerializableProps(rule.constraint))}),
}
function transformValidation(validation) {
  const validationArray = (Array.isArray(validation) ? validation : [validation]).filter((v) => typeof v === 'object' && v && '_type' in v)
  const disallowedFlags = ['type']
  const serialized = validationArray.map(({_rules, _message, _level}) => {
    const message = typeof _message === 'string' ? {message: _message} : {}
    return {
      rules: _rules.filter((rule) => {
        if (!('constraint' in rule)) return false
        const {flag, constraint} = rule
        if (disallowedFlags.includes(flag)) return false
        return !(typeof constraint === 'object' && constraint && 'type' in constraint && disallowedConstraintTypes.includes(constraint.type))
      }).reduce((rules, rule) => {
        const t = (validationRuleTransformers[rule.flag] ?? ((spec) => retainSerializableProps(spec)))(rule)
        return t ? [...rules, t] : rules
      }, []),
      level: _level,
      ...message,
    }
  }).filter((g) => !!g.rules.length)
  return serialized.length ? {validation: serialized} : {}
}

function transformFieldsets(type) {
  if (type.jsonType !== 'object') return {}
  const fieldsets = type.fieldsets?.filter((fs) => !fs.single).map((fs) => {
    const options = isRecord(fs.options) ? {options: retainSerializableProps(fs.options)} : {}
    return {
      name: fs.name,
      ...ensureCustomTitle(fs.name, fs.title),
      ...ensureString('description', fs.description),
      ...ensureConditional('readOnly', fs.readOnly),
      ...ensureConditional('hidden', fs.hidden),
      ...options,
    }
  })
  return fieldsets?.length ? {fieldsets} : {}
}

function transformReference(reference) {
  return {to: (reference.to ?? []).map((type) => ({...retainCustomTypeProps(type), type: type.name}))}
}
function transformCrossDatasetReference(reference) {
  return {
    to: (reference.to ?? []).map((cd) => {
      const preview = cd.preview?.select ? {preview: {select: cd.preview.select}} : {}
      return {type: cd.type, ...ensureCustomTitle(cd.type, cd.title), ...preview}
    }),
  }
}
function transformGlobalDocumentReference(reference) {
  return {
    to: (reference.to ?? []).map((cd) => {
      const preview = cd.preview?.select ? {preview: {select: cd.preview.select}} : {}
      return {type: cd.type, ...ensureCustomTitle(cd.type, cd.title), ...preview}
    }),
  }
}

function transformField(field) {
  const fieldType = field.type
  const typeName = getDefinedTypeName(fieldType) ?? fieldType.name
  return {
    ...transformCommonTypeFields(fieldType, typeName),
    name: field.name,
    type: typeName,
    ...ensureCustomTitle(field.name, fieldType.title),
    ...ensureString('fieldset', field.fieldset),
  }
}

function transformArrayMember(arrayMember) {
  return {
    of: arrayMember.of.map((type) => {
      const typeName = getDefinedTypeName(type) ?? type.name
      return {
        ...transformCommonTypeFields(type, typeName),
        type: typeName,
        ...(typeName === type.name ? {} : {name: type.name}),
        ...ensureCustomTitle(type.name, type.title),
      }
    }),
  }
}

function resolveTitleValueArray(possibleArray) {
  if (!possibleArray || !Array.isArray(possibleArray)) return undefined
  const titled = possibleArray.filter((d) => isRecord(d) && !!d.value && isString(d.value)).map((item) => ({value: item.value, ...ensureString('title', item.title)}))
  return titled.length ? titled : undefined
}
function resolveEnabledStyles(blockType) {
  const styleField = blockType.fields?.find((f) => f.name === 'style')
  return resolveTitleValueArray(styleField?.type?.options?.list)
}
function resolveEnabledDecorators(spanType) {
  return 'decorators' in spanType ? resolveTitleValueArray(spanType.decorators) : undefined
}
function resolveEnabledListItems(blockType) {
  const listField = blockType.fields?.find((f) => f.name === 'listItem')
  return resolveTitleValueArray(listField?.type?.options?.list)
}
function transformBlockType(blockType) {
  if (blockType.jsonType !== 'object' || !isType(blockType, 'block')) return {}
  const childrenField = blockType.fields?.find((f) => f.name === 'children')
  if (!childrenField) return {}
  const ofType = childrenField.type.of
  if (!ofType) return {}
  const spanType = ofType.find((m) => m.name === 'span')
  if (!spanType) return {}
  const inlineObjectTypes = ofType.filter((m) => m.name !== 'span') || []
  return {
    marks: {annotations: spanType.annotations.map((t) => transformType(t)), decorators: resolveEnabledDecorators(spanType)},
    lists: resolveEnabledListItems(blockType),
    styles: resolveEnabledStyles(blockType),
    of: inlineObjectTypes.map((t) => transformType(t)),
  }
}

function transformCommonTypeFields(type, typeName) {
  const arrayProps = typeName === 'array' && type.jsonType === 'array' ? transformArrayMember(type) : {}
  const referenceProps = isReference(type) ? transformReference(type) : {}
  const crossDatasetRefProps = isCrossDatasetReference(type) ? transformCrossDatasetReference(type) : {}
  const globalRefProps = isGlobalDocumentReference(type) ? transformGlobalDocumentReference(type) : {}
  const objectFields = type.jsonType === 'object' && type.type && isCustomized(type)
    ? {fields: getCustomFields(type).map((f) => transformField(f))} : {}
  return {
    ...retainCustomTypeProps(type),
    ...transformValidation(type.validation),
    ...ensureString('description', type.description),
    ...objectFields,
    ...arrayProps,
    ...referenceProps,
    ...crossDatasetRefProps,
    ...globalRefProps,
    ...ensureConditional('readOnly', type.readOnly),
    ...ensureConditional('hidden', type.hidden),
    ...transformFieldsets(type),
    ...ensureString('fieldset', type.fieldset),
    ...transformBlockType(type),
  }
}

function transformType(type) {
  const typeName = type.type ? type.type.name : type.jsonType
  return {
    ...transformCommonTypeFields(type, typeName),
    name: type.name,
    type: typeName,
    ...ensureCustomTitle(type.name, type.title),
  }
}

function extractManifestSchemaTypes(schemaObj) {
  const typeNames = schemaObj.getTypeNames()
  const studioDefaultTypeNames = sanity.createSchema({name: 'default', types: []}).getTypeNames()
  return typeNames
    .filter((tn) => !studioDefaultTypeNames.includes(tn))
    .map((tn) => schemaObj.get(tn))
    .filter((t) => typeof t !== 'undefined')
    .map((t) => transformType(t))
}

const serializedSchema = extractManifestSchemaTypes(schema)

const out = path.join(__dirname, 'schema.json')
fs.writeFileSync(out, JSON.stringify(serializedSchema, null, 2))
console.log(`Wrote ${serializedSchema.length} types to ${out}`)
