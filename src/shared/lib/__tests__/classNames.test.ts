import { describe, it, expect } from 'vitest';
import { classNames } from '../classNames';

describe('classNames', () => {
  describe('base class handling', () => {
    it('returns base class when no mods or additional', () => {
      expect(classNames('base')).toBe('base');
    });

    it('returns empty string when base is empty', () => {
      expect(classNames('')).toBe('');
    });
  });

  describe('mods object handling', () => {
    it('includes class name when mod value is true', () => {
      expect(classNames('base', { active: true })).toBe('base active');
    });

    it('excludes class name when mod value is false', () => {
      expect(classNames('base', { active: false })).toBe('base');
    });

    it('excludes class name when mod value is undefined', () => {
      expect(classNames('base', { active: undefined })).toBe('base');
    });

    it('excludes class name when mod value is empty string', () => {
      expect(classNames('base', { active: '' })).toBe('base');
    });

    it('includes class name when mod value is truthy string', () => {
      expect(classNames('base', { theme: 'dark' })).toBe('base theme');
    });

    it('handles multiple mods correctly', () => {
      const result = classNames('base', {
        active: true,
        disabled: false,
        highlighted: true,
      });
      expect(result).toBe('base active highlighted');
    });
  });

  describe('additional classes array', () => {
    it('includes additional classes', () => {
      expect(classNames('base', {}, ['extra', 'more'])).toBe('base extra more');
    });

    it('filters undefined values from additional', () => {
      expect(classNames('base', {}, ['extra', undefined, 'more'])).toBe('base extra more');
    });

    it('filters empty strings from additional', () => {
      expect(classNames('base', {}, ['', 'valid'])).toBe('base valid');
    });
  });

  describe('combined usage', () => {
    it('combines base, mods, and additional correctly', () => {
      const result = classNames('card', { active: true, hidden: false }, ['rounded', 'shadow']);
      expect(result).toBe('card rounded shadow active');
    });

    it('handles empty mods and additional', () => {
      expect(classNames('base', {}, [])).toBe('base');
    });
  });
});
