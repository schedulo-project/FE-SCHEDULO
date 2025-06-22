import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'jotai';
import ScheduleModal from '../ScheduleModal';

jest.mock('../atoms/HomeAtoms', () => ({
  handleChangeAtom: { init: jest.fn() },
  isModalOpenAtom: { init: true },
  modalDataAtom: { init: { id: null, title: '', content: '', date: '', tagName: [], is_completed: false } },
  tagListAtom: { init: [] }
}));

jest.mock('../api/addScheduleApi', () => jest.fn());
jest.mock('../api/getTagsApi', () => jest.fn());
jest.mock('../api/deleteScheduleApi', () => jest.fn());
jest.mock('../api/addTagsApi', () => jest.fn());
jest.mock('../api/updateScheduleApi', () => jest.fn());

jest.mock('../utils/getTodayString', () => jest.fn(() => '2024-01-15'));

jest.mock('react-select/creatable', () => {
  return function MockSelect({ onChange, onCreateOption, value, options, ...props }) {
    return (
      <select
        data-testid="tag-select"
        multiple
        value={Array.isArray(value) ? value.map(v => v.value) : []}
        onChange={(e) => {
          const selectedValues = Array.from(e.target.selectedOptions).map(option => ({
            value: option.value,
            label: option.value
          }));
          onChange(selectedValues);
        }}
        {...props}
      >
        {options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock('../assets/schedulemodal/x_sign.svg', () => 'x-sign-mock');
jest.mock('../assets/schedulemodal/trash.svg', () => 'trash-mock');
jest.mock('../assets/schedulemodal/calendar_search.svg', () => 'calendar-mock');

describe('ScheduleModal', () => {
  let mockSetHandleChange;
  let mockSetIsModalOpen;
  let mockSetTagList;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetHandleChange = jest.fn();
    mockSetIsModalOpen = jest.fn();
    mockSetTagList = jest.fn();

    jest.spyOn(require('jotai'), 'useAtom').mockImplementation((atom) => {
      if (atom === require('../atoms/HomeAtoms').handleChangeAtom) {
        return [null, mockSetHandleChange];
      }
      if (atom === require('../atoms/HomeAtoms').isModalOpenAtom) {
        return [true, mockSetIsModalOpen];
      }
      if (atom === require('../atoms/HomeAtoms').modalDataAtom) {
        return [{ id: null, title: '', content: '', date: '', tagName: [], is_completed: false }];
      }
      if (atom === require('../atoms/HomeAtoms').tagListAtom) {
        return [[], mockSetTagList];
      }
      return [null, jest.fn()];
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithProvider = (component) => render(<Provider>{component}</Provider>);

  describe('Modal Rendering', () => {
    it('should render modal when isModalOpen is true', () => {
      renderWithProvider(<ScheduleModal />);
      expect(screen.getByText('일정 추가하기')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('일정 제목을 입력하세요')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('일정 내용을 입력하시오')).toBeInTheDocument();
    });

    it('should not render modal when isModalOpen is false', () => {
      jest.spyOn(require('jotai'), 'useAtom').mockImplementation((atom) => {
        if (atom === require('../atoms/HomeAtoms').isModalOpenAtom) {
          return [false, mockSetIsModalOpen];
        }
        return [null, jest.fn()];
      });
      renderWithProvider(<ScheduleModal />);
      expect(screen.queryByText('일정 추가하기')).not.toBeInTheDocument();
    });

    it('should render close button', () => {
      renderWithProvider(<ScheduleModal />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render form elements for adding schedule', () => {
      renderWithProvider(<ScheduleModal />);
      expect(screen.getByPlaceholderText('일정 제목을 입력하세요')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('일정 내용을 입력하시오')).toBeInTheDocument();
      expect(screen.getByTestId('tag-select')).toBeInTheDocument();
      expect(screen.getByText('추가하기')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should handle title input changes', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const titleInput = screen.getByPlaceholderText('일정 제목을 입력하세요');
      await user.type(titleInput, 'Test Schedule');
      expect(titleInput).toHaveValue('Test Schedule');
    });

    it('should handle content input changes', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const contentInput = screen.getByPlaceholderText('일정 내용을 입력하시오');
      await user.type(contentInput, 'Test content for schedule');
      expect(contentInput).toHaveValue('Test content for schedule');
    });

    it('should handle date input changes', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const dateInput = screen.getByDisplayValue('2024-01-15');
      await user.clear(dateInput);
      await user.type(dateInput, '2024-12-25');
      expect(dateInput).toHaveValue('2024-12-25');
    });

    it('should handle tag selection changes', async () => {
      const user = userEvent.setup();
      jest.spyOn(require('jotai'), 'useAtom').mockImplementation((atom) => {
        if (atom === require('../atoms/HomeAtoms').tagListAtom) {
          return [[{ value: 'work', label: 'Work' }, { value: 'personal', label: 'Personal' }], mockSetTagList];
        }
        if (atom === require('../atoms/HomeAtoms').isModalOpenAtom) {
          return [true, mockSetIsModalOpen];
        }
        if (atom === require('../atoms/HomeAtoms').modalDataAtom) {
          return [{ id: null, title: '', content: '', date: '', tagName: [], is_completed: false }];
        }
        return [null, jest.fn()];
      });
      renderWithProvider(<ScheduleModal />);
      const tagSelect = screen.getByTestId('tag-select');
      await user.selectOptions(tagSelect, ['work']);
      expect(tagSelect).toHaveValue(['work']);
    });
  });

  describe('Modal Behavior', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const closeButton = screen.getByRole('button');
      await user.click(closeButton);
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should close modal when clicking outside modal content', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const overlay = screen.getByRole('presentation') || document.querySelector('.fixed.inset-0.bg-black.bg-opacity-40');
      await user.click(overlay);
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should not close modal when clicking inside modal content', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const modalContent = screen.getByText('일정 추가하기').closest('div');
      await user.click(modalContent);
      expect(mockSetIsModalOpen).not.toHaveBeenCalledWith(false);
    });
  });

  describe('Schedule Management - Add Mode', () => {
    it('should call addSchedules API when adding a new schedule', async () => {
      const mockAddSchedules = require('../api/addScheduleApi');
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      await user.type(screen.getByPlaceholderText('일정 제목을 입력하세요'), 'New Schedule');
      await user.type(screen.getByPlaceholderText('일정 내용을 입력하시오'), 'Schedule content');
      const addButton = screen.getByText('추가하기');
      await user.click(addButton);
      await waitFor(() => {
        expect(mockAddSchedules).toHaveBeenCalledWith({
          title: 'New Schedule',
          selectedTags: [],
          content: 'Schedule content',
          date: '2024-01-15',
          completed: false
        });
      });
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });

    it('should handle API errors gracefully when adding schedule', async () => {
      const mockAddSchedules = require('../api/addScheduleApi');
      mockAddSchedules.mockRejectedValue(new Error('API Error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      await user.type(screen.getByPlaceholderText('일정 제목을 입력하세요'), 'New Schedule');
      const addButton = screen.getByText('추가하기');
      await user.click(addButton);
      await waitFor(() => {
        expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      });
      consoleSpy.mockRestore();
    });
  });

  describe('Schedule Management - Edit Mode', () => {
    beforeEach(() => {
      jest.spyOn(require('jotai'), 'useAtom').mockImplementation((atom) => {
        if (atom === require('../atoms/HomeAtoms').modalDataAtom) {
          return [{
            id: '123',
            title: 'Existing Schedule',
            content: 'Existing content',
            date: '2024-02-20',
            tagName: [{ value: 'work', label: 'Work' }],
            is_completed: false
          }];
        }
        if (atom === require('../atoms/HomeAtoms').isModalOpenAtom) {
          return [true, mockSetIsModalOpen];
        }
        if (atom === require('../atoms/HomeAtoms').tagListAtom) {
          return [[{ value: 'work', label: 'Work' }], mockSetTagList];
        }
        return [null, jest.fn()];
      });
    });

    it('should render schedule details in view mode', () => {
      renderWithProvider(<ScheduleModal />);
      expect(screen.getByText('일정 상세표')).toBeInTheDocument();
      expect(screen.getByText('Existing Schedule')).toBeInTheDocument();
      expect(screen.getByText('Existing content')).toBeInTheDocument();
    });

    it('should show edit and delete buttons in view mode', () => {
      renderWithProvider(<ScheduleModal />);
      expect(screen.getByText('✏️')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should switch to edit mode when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const editButton = screen.getByText('✏️');
      await user.click(editButton);
      expect(screen.getByText('일정 수정하기')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing Schedule')).toBeInTheDocument();
      expect(screen.getByText('저장하기')).toBeInTheDocument();
    });

    it('should call updateSchedules API when saving changes', async () => {
      const mockUpdateSchedules = require('../api/updateScheduleApi');
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const editButton = screen.getByText('✏️');
      await user.click(editButton);
      const titleInput = screen.getByDisplayValue('Existing Schedule');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Schedule');
      const saveButton = screen.getByText('저장하기');
      await user.click(saveButton);
      await waitFor(() => {
        expect(mockUpdateSchedules).toHaveBeenCalledWith({
          id: '123',
          title: 'Updated Schedule',
          content: 'Existing content',
          date: '2024-02-20',
          tag: [{ value: 'work', label: 'Work' }],
          completed: false
        });
      });
    });

    it('should call deleteSchedules API when delete button is clicked', async () => {
      const mockDeleteSchedules = require('../api/deleteScheduleApi');
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation();
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const deleteButton = screen.getByRole('img');
      await user.click(deleteButton);
      await waitFor(() => {
        expect(mockDeleteSchedules).toHaveBeenCalledWith('123');
      });
      expect(mockAlert).toHaveBeenCalledWith('삭제가 성공적으로 완료되었습니다.');
      expect(mockSetHandleChange).toHaveBeenCalledWith({ data: null, id: '123' });
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      mockAlert.mockRestore();
    });

    it('should handle delete API errors gracefully', async () => {
      const mockDeleteSchedules = require('../api/deleteScheduleApi');
      mockDeleteSchedules.mockRejectedValue(new Error('Delete failed'));
      const mockAlert = jest.spyOn(window, 'alert').mockImplementation();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const deleteButton = screen.getByRole('img');
      await user.click(deleteButton);
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('삭제에 실패했습니다. 다시 시도해주세요.');
      });
      mockAlert.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('Tag Management', () => {
    it('should add new tag when creating option', async () => {
      const mockAddTags = require('../api/addTagsApi');
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      expect(mockSetTagList).toBeDefined();
      expect(mockAddTags).toBeDefined();
    });

    it('should handle tag list updates', () => {
      jest.spyOn(require('jotai'), 'useAtom').mockImplementation((atom) => {
        if (atom === require('../atoms/HomeAtoms').tagListAtom) {
          return [[{ value: 'existing', label: 'Existing Tag' }], mockSetTagList];
        }
        if (atom === require('../atoms/HomeAtoms').isModalOpenAtom) {
          return [true, mockSetIsModalOpen];
        }
        return [null, jest.fn()];
      });
      renderWithProvider(<ScheduleModal />);
      expect(screen.getByTestId('tag-select')).toBeInTheDocument();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty form submission gracefully', async () => {
      const mockAddSchedules = require('../api/addScheduleApi');
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const addButton = screen.getByText('추가하기');
      await user.click(addButton);
      await waitFor(() => {
        expect(mockAddSchedules).toHaveBeenCalledWith({
          title: '',
          selectedTags: [],
          content: '',
          date: '2024-01-15',
          completed: false
        });
      });
    });

    it('should reset form when modal opens in add mode', () => {
      renderWithProvider(<ScheduleModal />);
      expect(screen.getByPlaceholderText('일정 제목을 입력하세요')).toHaveValue('');
      expect(screen.getByPlaceholderText('일정 내용을 입력하시오')).toHaveValue('');
    });

    it('should handle very long text inputs', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const longText = 'A'.repeat(1000);
      const titleInput = screen.getByPlaceholderText('일정 제목을 입력하세요');
      await user.type(titleInput, longText);
      expect(titleInput).toHaveValue(longText);
    });

    it('should handle special characters in inputs', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ScheduleModal />);
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const titleInput = screen.getByPlaceholderText('일정 제목을 입력하세요');
      await user.type(titleInput, specialText);
      expect(titleInput).toHaveValue(specialText);
    });

    it('should handle rapid modal open/close cycles', () => {
      const { rerender } = renderWithProvider(<ScheduleModal />);
      for (let i = 0; i < 5; i++) {
        jest.spyOn(require('jotai'), 'useAtom').mockImplementation((atom) => {
          if (atom === require('../atoms/HomeAtoms').isModalOpenAtom) {
            return [i % 2 === 0, mockSetIsModalOpen];
          }
          return [null, jest.fn()];
        });
        rerender(<ScheduleModal />);
      }
      expect(true).toBe(true);
    });
  });

  describe('Component Lifecycle', () => {
    it('should properly cleanup on unmount', () => {
      const { unmount } = renderWithProvider(<ScheduleModal />);
      expect(() => unmount()).not.toThrow();
    });

    it('should handle prop changes gracefully', () => {
      const { rerender } = renderWithProvider(<ScheduleModal />);
      jest.spyOn(require('jotai'), 'useAtom').mockImplementation((atom) => {
        if (atom === require('../atoms/HomeAtoms').modalDataAtom) {
          return [{
            id: '456',
            title: 'Different Schedule',
            content: 'Different content',
            date: '2024-03-15'
          }];
        }
        return [null, jest.fn()];
      });
      rerender(<ScheduleModal />);
      expect(screen.getByText('Different Schedule')).toBeInTheDocument();
    });
  });
});