import { jest } from '@jest/globals';
import { addTagsApi, updateTagsApi, removeTagsApi } from '../addTagsApi.js';

jest.mock('../httpClient', () => ({
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

describe('addTagsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path Scenarios', () => {
    test('should successfully add single tag to item', async () => {
      const mockResponse = { success: true, tags: ['test-tag'] };
      require('../httpClient').post.mockResolvedValue(mockResponse);

      const result = await addTagsApi('item-123', ['test-tag']);

      expect(result).toEqual(mockResponse);
      expect(require('../httpClient').post).toHaveBeenCalledWith(
        '/api/items/item-123/tags',
        { tags: ['test-tag'] }
      );
    });

    test('should successfully add multiple tags to item', async () => {
      const tags = ['tag1', 'tag2', 'tag3'];
      const mockResponse = { success: true, tags };
      require('../httpClient').post.mockResolvedValue(mockResponse);

      const result = await addTagsApi('item-456', tags);

      expect(result).toEqual(mockResponse);
      expect(require('../httpClient').post).toHaveBeenCalledWith(
        '/api/items/item-456/tags',
        { tags }
      );
    });

    test('should handle empty tags array gracefully', async () => {
      const mockResponse = { success: true, tags: [] };
      require('../httpClient').post.mockResolvedValue(mockResponse);

      const result = await addTagsApi('item-789', []);

      expect(result).toEqual(mockResponse);
      expect(require('../httpClient').post).toHaveBeenCalledWith(
        '/api/items/item-789/tags',
        { tags: [] }
      );
    });
  });

  describe('Edge Cases and Input Validation', () => {
    test('should throw error when itemId is null or undefined', async () => {
      await expect(addTagsApi(null, ['tag'])).rejects.toThrow('Item ID is required');
      await expect(addTagsApi(undefined, ['tag'])).rejects.toThrow('Item ID is required');
    });

    test('should throw error when itemId is empty string', async () => {
      await expect(addTagsApi('', ['tag'])).rejects.toThrow('Item ID cannot be empty');
    });

    test('should throw error when tags parameter is not an array', async () => {
      await expect(addTagsApi('item-123', 'not-array')).rejects.toThrow('Tags must be an array');
      await expect(addTagsApi('item-123', null)).rejects.toThrow('Tags must be an array');
      await expect(addTagsApi('item-123', {})).rejects.toThrow('Tags must be an array');
    });

    test('should handle very long tag names', async () => {
      const longTag = 'a'.repeat(1000);
      const mockResponse = { success: true, tags: [longTag] };
      require('../httpClient').post.mockResolvedValue(mockResponse);

      const result = await addTagsApi('item-123', [longTag]);

      expect(result).toEqual(mockResponse);
    });

    test('should handle special characters in tags', async () => {
      const specialTags = ['tag-with-dash', 'tag_with_underscore', 'tag.with.dot', 'tag@symbol'];
      const mockResponse = { success: true, tags: specialTags };
      require('../httpClient').post.mockResolvedValue(mockResponse);

      const result = await addTagsApi('item-123', specialTags);

      expect(result).toEqual(mockResponse);
    });

    test('should handle unicode characters in tags', async () => {
      const unicodeTags = ['标签', 'étiquette', '🏷️', 'тег'];
      const mockResponse = { success: true, tags: unicodeTags };
      require('../httpClient').post.mockResolvedValue(mockResponse);

      const result = await addTagsApi('item-123', unicodeTags);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling and Failure Conditions', () => {
    test('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed');
      require('../httpClient').post.mockRejectedValue(networkError);

      await expect(addTagsApi('item-123', ['tag'])).rejects.toThrow('Network request failed');
    });

    test('should handle HTTP 400 Bad Request', async () => {
      const badRequestError = {
        status: 400,
        message: 'Invalid tag format',
        response: { data: { error: 'Tags cannot contain spaces' } }
      };
      require('../httpClient').post.mockRejectedValue(badRequestError);

      await expect(addTagsApi('item-123', ['invalid tag'])).rejects.toMatchObject(badRequestError);
    });

    test('should handle HTTP 401 Unauthorized', async () => {
      const unauthorizedError = { status: 401, message: 'Unauthorized' };
      require('../httpClient').post.mockRejectedValue(unauthorizedError);

      await expect(addTagsApi('item-123', ['tag'])).rejects.toMatchObject(unauthorizedError);
    });

    test('should handle HTTP 404 Not Found', async () => {
      const notFoundError = { status: 404, message: 'Item not found' };
      require('../httpClient').post.mockRejectedValue(notFoundError);

      await expect(addTagsApi('nonexistent-item', ['tag'])).rejects.toMatchObject(notFoundError);
    });

    test('should handle HTTP 500 Internal Server Error', async () => {
      const serverError = { status: 500, message: 'Internal server error' };
      require('../httpClient').post.mockRejectedValue(serverError);

      await expect(addTagsApi('item-123', ['tag'])).rejects.toMatchObject(serverError);
    });

    test('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      require('../httpClient').post.mockRejectedValue(timeoutError);

      await expect(addTagsApi('item-123', ['tag'])).rejects.toThrow('Request timeout');
    });
  });
});

describe('updateTagsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully update tags for item', async () => {
    const newTags = ['updated-tag1', 'updated-tag2'];
    const mockResponse = { success: true, tags: newTags };
    require('../httpClient').put.mockResolvedValue(mockResponse);

    const result = await updateTagsApi('item-123', newTags);

    expect(result).toEqual(mockResponse);
    expect(require('../httpClient').put).toHaveBeenCalledWith(
      '/api/items/item-123/tags',
      { tags: newTags }
    );
  });

  test('should handle update with empty tags array', async () => {
    const mockResponse = { success: true, tags: [] };
    require('../httpClient').put.mockResolvedValue(mockResponse);

    const result = await updateTagsApi('item-123', []);

    expect(result).toEqual(mockResponse);
  });
});

describe('removeTagsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully remove specific tags from item', async () => {
    const tagsToRemove = ['tag-to-remove'];
    const mockResponse = { success: true, removedTags: tagsToRemove };
    require('../httpClient').delete.mockResolvedValue(mockResponse);

    const result = await removeTagsApi('item-123', tagsToRemove);

    expect(result).toEqual(mockResponse);
    expect(require('../httpClient').delete).toHaveBeenCalledWith(
      '/api/items/item-123/tags',
      { data: { tags: tagsToRemove } }
    );
  });

  test('should successfully remove all tags when no specific tags provided', async () => {
    const mockResponse = { success: true, removedTags: [] };
    require('../httpClient').delete.mockResolvedValue(mockResponse);

    const result = await removeTagsApi('item-123');

    expect(result).toEqual(mockResponse);
  });
});

describe('Performance and Concurrency Tests', () => {
  test('should handle multiple concurrent addTags requests', async () => {
    const mockResponse = { success: true, tags: ['concurrent-tag'] };
    require('../httpClient').post.mockResolvedValue(mockResponse);

    const promises = Array.from({ length: 10 }, (_, i) =>
      addTagsApi(`item-${i}`, [`tag-${i}`])
    );

    const results = await Promise.all(promises);

    expect(results).toHaveLength(10);
    results.forEach(result => {
      expect(result).toEqual(mockResponse);
    });
    expect(require('../httpClient').post).toHaveBeenCalledTimes(10);
  });

  test('should handle large number of tags efficiently', async () => {
    const largeTags = Array.from({ length: 100 }, (_, i) => `tag-${i}`);
    const mockResponse = { success: true, tags: largeTags };
    require('../httpClient').post.mockResolvedValue(mockResponse);

    const result = await addTagsApi('item-123', largeTags);

    expect(result).toEqual(mockResponse);
    expect(require('../httpClient').post).toHaveBeenCalledWith(
      '/api/items/item-123/tags',
      { tags: largeTags }
    );
  });
});

describe('Integration Tests', () => {
  test('should properly transform and validate request data', async () => {
    const mockResponse = { success: true, tags: ['validated-tag'] };
    require('../httpClient').post.mockImplementation((url, data) => {
      expect(url).toBe('/api/items/item-123/tags');
      expect(data).toHaveProperty('tags');
      expect(Array.isArray(data.tags)).toBe(true);
      expect(data.tags).toEqual(['validated-tag']);
      return Promise.resolve(mockResponse);
    });

    await addTagsApi('item-123', ['validated-tag']);
  });

  test('should handle response data transformation correctly', async () => {
    const serverResponse = {
      success: true,
      data: { tags: ['server-tag'] },
      metadata: { timestamp: Date.now() }
    };
    require('../httpClient').post.mockResolvedValue(serverResponse);

    const result = await addTagsApi('item-123', ['server-tag']);

    expect(result).toEqual(serverResponse);
  });
});