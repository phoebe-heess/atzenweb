import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CloverMark } from '../ornaments/CloverMark';

describe('CloverMark', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<CloverMark />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
  });

  it('applies custom className', () => {
    const { container } = render(<CloverMark className="custom-class" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('custom-class');
  });

  it('applies correct size classes', () => {
    const { container } = render(<CloverMark size="sm" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-3', 'h-3');
    
    const { container: container2 } = render(<CloverMark size="lg" />);
    
    const svg2 = container2.querySelector('svg');
    expect(svg2).toHaveClass('w-8', 'h-8');
  });
});
