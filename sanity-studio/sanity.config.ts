import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

// Fill in once a Sanity project exists (sanity.io/manage or `sanity init`).
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || 'z2q473zx'
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'

export default defineConfig({
  name: 'atzengold',
  title: 'Atzengold CMS',
  projectId: PROJECT_ID,
  dataset: DATASET,
  plugins: [structureTool({structure}), visionTool()],
  schema: {types: schemaTypes},
})
