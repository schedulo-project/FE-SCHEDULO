import addTags from '../addTagsApi';
import axios from 'axios';
import GetCookie from '../GetCookie';

// Mock external dependencies
jest.mock('axios');
jest.mock('../GetCookie');

const mockedAxios = axios;
const mockedGetCookie = GetCookie;

describe('addTags API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset console methods to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Default successful GetCookie mock
    mockedGetCookie.mockResolvedValue({
      access: 'mock-access-token'
    });
  });

  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });
});

describe('Happy Path Scenarios', () => {
  test('should successfully create a tag with valid name', async () => {
    const mockResponse = {
      data: { id: 1, name: 'test-tag' },
      status: 200,
      statusText: 'OK'
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags('test-tag');
    
    expect(mockedGetCookie).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://13.124.140.60/schedules/tags/',
      { name: 'test-tag' },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-access-token'
        }
      }
    );
    expect(result).toEqual(mockResponse);
    expect(console.log).toHaveBeenCalledWith('response', mockResponse);
  });

  test('should handle tag names with special characters', async () => {
    const specialTagName = 'tag-with-special-chars_123@domain';
    const mockResponse = {
      data: { id: 2, name: specialTagName },
      status: 200
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(specialTagName);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://13.124.140.60/schedules/tags/',
      { name: specialTagName },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-access-token'
        })
      })
    );
    expect(result).toEqual(mockResponse);
  });

  test('should handle unicode characters in tag names', async () => {
    const unicodeTagName = '태그-名前-тег';
    const mockResponse = {
      data: { id: 3, name: unicodeTagName },
      status: 200
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(unicodeTagName);
    
    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { name: unicodeTagName },
      expect.any(Object)
    );
  });
});

describe('Edge Cases', () => {
  test('should handle empty string tag name', async () => {
    const mockResponse = {
      data: { id: 4, name: '' },
      status: 200
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags('');
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { name: '' },
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  test('should handle very long tag names', async () => {
    const longTagName = 'a'.repeat(1000);
    const mockResponse = {
      data: { id: 5, name: longTagName },
      status: 200
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(longTagName);
    
    expect(result).toEqual(mockResponse);
  });

  test('should handle tag names with only whitespace', async () => {
    const whitespaceTagName = '   \t\n   ';
    const mockResponse = {
      data: { id: 6, name: whitespaceTagName },
      status: 200
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(whitespaceTagName);
    
    expect(result).toEqual(mockResponse);
  });

  test('should handle numeric tag names', async () => {
    const numericTagName = '12345';
    const mockResponse = {
      data: { id: 7, name: numericTagName },
      status: 200
    };
    
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(numericTagName);
    
    expect(result).toEqual(mockResponse);
  });
});

describe('Server Error Handling', () => {
  test('should handle 400 Bad Request error', async () => {
    const errorResponse = {
      response: {
        status: 400,
        data: { error: 'Bad Request', message: 'Invalid tag name' }
      }
    };
    
    mockedAxios.post.mockRejectedValue(errorResponse);
    
    await expect(addTags('invalid-tag')).rejects.toEqual(errorResponse);
    expect(console.error).toHaveBeenCalledWith('Server Error:', errorResponse.response.data);
  });

  test('should handle 401 Unauthorized error', async () => {
    const errorResponse = {
      response: {
        status: 401,
        data: { error: 'Unauthorized', message: 'Invalid token' }
      }
    };
    
    mockedAxios.post.mockRejectedValue(errorResponse);
    
    await expect(addTags('test-tag')).rejects.toEqual(errorResponse);
    expect(console.error).toHaveBeenCalledWith('Server Error:', errorResponse.response.data);
  });

  test('should handle 403 Forbidden error', async () => {
    const errorResponse = {
      response: {
        status: 403,
        data: { error: 'Forbidden', message: 'Insufficient permissions' }
      }
    };
    
    mockedAxios.post.mockRejectedValue(errorResponse);
    
    await expect(addTags('test-tag')).rejects.toEqual(errorResponse);
    expect(console.error).toHaveBeenCalledWith('Server Error:', errorResponse.response.data);
  });

  test('should handle 500 Internal Server Error', async () => {
    const errorResponse = {
      response: {
        status: 500,
        data: { error: 'Internal Server Error', message: 'Database connection failed' }
      }
    };
    
    mockedAxios.post.mockRejectedValue(errorResponse);
    
    await expect(addTags('test-tag')).rejects.toEqual(errorResponse);
    expect(console.error).toHaveBeenCalledWith('Server Error:', errorResponse.response.data);
  });

  test('should handle server error with empty response data', async () => {
    const errorResponse = {
      response: {
        status: 500,
        data: null
      }
    };
    
    mockedAxios.post.mockRejectedValue(errorResponse);
    
    await expect(addTags('test-tag')).rejects.toEqual(errorResponse);
    expect(console.error).toHaveBeenCalledWith('Server Error:', null);
  });
});

describe('Network Error Handling', () => {
  test('should handle network timeout error', async () => {
    const networkError = new Error('timeout of 5000ms exceeded');
    networkError.code = 'ECONNABORTED';
    
    mockedAxios.post.mockRejectedValue(networkError);
    
    await expect(addTags('test-tag')).rejects.toEqual(networkError);
    expect(console.error).toHaveBeenCalledWith('Network Error:', networkError.message);
  });

  test('should handle connection refused error', async () => {
    const networkError = new Error('connect ECONNREFUSED 13.124.140.60:80');
    networkError.code = 'ECONNREFUSED';
    
    mockedAxios.post.mockRejectedValue(networkError);
    
    await expect(addTags('test-tag')).rejects.toEqual(networkError);
    expect(console.error).toHaveBeenCalledWith('Network Error:', networkError.message);
  });

  test('should handle DNS resolution error', async () => {
    const networkError = new Error('getaddrinfo ENOTFOUND 13.124.140.60');
    networkError.code = 'ENOTFOUND';
    
    mockedAxios.post.mockRejectedValue(networkError);
    
    await expect(addTags('test-tag')).rejects.toEqual(networkError);
    expect(console.error).toHaveBeenCalledWith('Network Error:', networkError.message);
  });

  test('should handle generic network error without response', async () => {
    const networkError = new Error('Network Error');
    // Explicitly ensure no response property
    delete networkError.response;
    
    mockedAxios.post.mockRejectedValue(networkError);
    
    await expect(addTags('test-tag')).rejects.toEqual(networkError);
    expect(console.error).toHaveBeenCalledWith('Network Error:', networkError.message);
  });
});

describe('Authentication Handling', () => {
  test('should handle GetCookie failure', async () => {
    const getCookieError = new Error('Failed to get authentication cookie');
    mockedGetCookie.mockRejectedValue(getCookieError);
    
    await expect(addTags('test-tag')).rejects.toEqual(getCookieError);
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test('should handle missing access token in GetCookie response', async () => {
    mockedGetCookie.mockResolvedValue({});
    
    const mockResponse = {
      data: { id: 1, name: 'test-tag' },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags('test-tag');
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer undefined'
        }
      }
    );
    expect(result).toEqual(mockResponse);
  });

  test('should handle null access token', async () => {
    mockedGetCookie.mockResolvedValue({ access: null });
    
    const mockResponse = {
      data: { id: 1, name: 'test-tag' },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    await addTags('test-tag');
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer null'
        }
      }
    );
  });

  test('should handle empty string access token', async () => {
    mockedGetCookie.mockResolvedValue({ access: '' });
    
    const mockResponse = {
      data: { id: 1, name: 'test-tag' },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    await addTags('test-tag');
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '
        }
      }
    );
  });
});

describe('Input Validation', () => {
  test('should handle undefined tag name', async () => {
    const mockResponse = {
      data: { id: 1, name: undefined },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(undefined);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { name: undefined },
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  test('should handle null tag name', async () => {
    const mockResponse = {
      data: { id: 1, name: null },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(null);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { name: null },
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  test('should handle boolean tag name', async () => {
    const mockResponse = {
      data: { id: 1, name: true },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(true);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { name: true },
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });

  test('should handle object as tag name', async () => {
    const objectTag = { toString: () => 'object-tag' };
    const mockResponse = {
      data: { id: 1, name: objectTag },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const result = await addTags(objectTag);
    
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      { name: objectTag },
      expect.any(Object)
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('Integration and Performance Tests', () => {
  test('should handle multiple concurrent requests', async () => {
    const mockResponse = {
      data: { id: 1, name: 'concurrent-tag' },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    const promises = Array.from({ length: 5 }, (_, i) =>
      addTags(`concurrent-tag-${i}`)
    );
    
    const results = await Promise.all(promises);
    
    expect(results).toHaveLength(5);
    results.forEach(result => {
      expect(result).toEqual(mockResponse);
    });
    expect(mockedGetCookie).toHaveBeenCalledTimes(5);
    expect(mockedAxios.post).toHaveBeenCalledTimes(5);
  });

  test('should handle rapid sequential calls', async () => {
    const mockResponse = {
      data: { id: 1, name: 'sequential-tag' },
      status: 200
    };
    mockedAxios.post.mockResolvedValue(mockResponse);
    
    for (let i = 0; i < 3; i++) {
      const result = await addTags(`sequential-tag-${i}`);
      expect(result).toEqual(mockResponse);
    }
    
    expect(mockedGetCookie).toHaveBeenCalledTimes(3);
    expect(mockedAxios.post).toHaveBeenCalledTimes(3);
  });

  test('should maintain proper error propagation in async context', async () => {
    const error = new Error('Test async error');
    mockedAxios.post.mockRejectedValue(error);
    
    const asyncTest = async () => {
      try {
        await addTags('error-tag');
        throw new Error('Should not reach here');
      } catch (e) {
        expect(e).toEqual(error);
        throw e; // Re-throw for outer test
      }
    };
    
    await expect(asyncTest()).rejects.toEqual(error);
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});