import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import ScheduleModal from '../ScheduleModal';

// Mock Date to have consistent tests
const mockDate = new Date('2024-12-20T10:00:00.000Z');

describe('ScheduleModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    initialData: null,
    mode: 'create'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper function to render component with default props
  const renderScheduleModal = (props = {}) => {
    return render(<ScheduleModal {...defaultProps} {...props} />);
  };

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      renderScheduleModal({ isOpen: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render modal when isOpen is true', () => {
      renderScheduleModal();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create Schedule')).toBeInTheDocument();
    });

    it('should render in edit mode with correct title', () => {
      renderScheduleModal({ mode: 'edit' });
      expect(screen.getByText('Edit Schedule')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      renderScheduleModal();

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/reminder/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/recurring event/i)).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      renderScheduleModal();

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create schedule/i })).toBeInTheDocument();
    });

    it('should render close button with proper aria-label', () => {
      renderScheduleModal();

      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('should show recurrence select when recurring is checked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const recurringCheckbox = screen.getByLabelText(/recurring event/i);
      await user.click(recurringCheckbox);

      expect(screen.getByDisplayValue('Weekly')).toBeInTheDocument();
    });
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form data in create mode', () => {
      renderScheduleModal({ mode: 'create' });

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
      expect(screen.getByLabelText(/date/i)).toHaveValue('');
      expect(screen.getByLabelText(/time/i)).toHaveValue('');
      expect(screen.getByLabelText(/duration/i)).toHaveValue(60);
      expect(screen.getByLabelText(/location/i)).toHaveValue('');
      expect(screen.getByLabelText(/recurring event/i)).not.toBeChecked();
    });

    it('should populate form with initialData when provided', () => {
      const initialData = {
        title: 'Test Meeting',
        description: 'Test Description',
        date: '2024-12-25',
        time: '14:30',
        duration: 90,
        location: 'Conference Room A',
        attendees: ['test@example.com'],
        reminder: 30,
        recurring: true,
        recurrenceType: 'monthly'
      };

      renderScheduleModal({ initialData, mode: 'edit' });

      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Meeting');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
      expect(screen.getByLabelText(/date/i)).toHaveValue('2024-12-25');
      expect(screen.getByLabelText(/time/i)).toHaveValue('14:30');
      expect(screen.getByLabelText(/duration/i)).toHaveValue(90);
      expect(screen.getByLabelText(/location/i)).toHaveValue('Conference Room A');
      expect(screen.getByLabelText(/recurring event/i)).toBeChecked();
      expect(screen.getByDisplayValue('Monthly')).toBeInTheDocument();
    });

    it('should reset form when mode changes to create', () => {
      const { rerender } = renderScheduleModal({
        initialData: { title: 'Test', date: '2024-12-25' },
        mode: 'edit'
      });

      expect(screen.getByLabelText(/title/i)).toHaveValue('Test');

      rerender(<ScheduleModal {...defaultProps} mode="create" />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('');
    });
  });

  describe('User Interactions', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onClose = vi.fn();
      renderScheduleModal({ onClose });

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onClose = vi.fn();
      renderScheduleModal({ onClose });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should update form fields when user types', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'New Meeting');

      expect(titleInput).toHaveValue('New Meeting');
    });

    it('should clear error when user starts typing in field with error', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimers });
      renderScheduleModal();

      // Submit form to trigger validation
      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      // Should show title error
      expect(screen.getByText('Title is required')).toBeInTheDocument();

      // Type in title field
      const titleInput = screen.getByLabelText(/title/i);
      await user.type(titleInput, 'Test');

      // Error should be cleared
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });

    it('should handle number input changes correctly', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const durationInput = screen.getByLabelText(/duration/i);
      await user.clear(durationInput);
      await user.type(durationInput, '120');

      expect(durationInput).toHaveValue(120);
    });

    it('should handle select changes correctly', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const reminderSelect = screen.getByLabelText(/reminder/i);
      await user.selectOptions(reminderSelect, '60');

      expect(reminderSelect).toHaveValue('60');
    });

    it('should toggle recurring checkbox and show/hide recurrence options', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const recurringCheckbox = screen.getByLabelText(/recurring event/i);

      // Initially not checked and no recurrence select visible
      expect(recurringCheckbox).not.toBeChecked();
      expect(screen.queryByDisplayValue('Weekly')).not.toBeInTheDocument();

      // Check the checkbox
      await user.click(recurringCheckbox);

      expect(recurringCheckbox).toBeChecked();
      expect(screen.getByDisplayValue('Weekly')).toBeInTheDocument();

      // Uncheck the checkbox
      await user.click(recurringCheckbox);

      expect(recurringCheckbox).not.toBeChecked();
      expect(screen.queryByDisplayValue('Weekly')).not.toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByText('Time is required')).toBeInTheDocument();
    });

    it('should validate minimum duration', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const durationInput = screen.getByLabelText(/duration/i);
      await user.clear(durationInput);
      await user.type(durationInput, '10');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      expect(screen.getByText('Duration must be at least 15 minutes')).toBeInTheDocument();
    });

    it('should validate future date and time', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      // Fill required fields with past date/time
      await user.type(screen.getByLabelText(/title/i), 'Test Meeting');
      await user.type(screen.getByLabelText(/date/i), '2024-12-19'); // Yesterday
      await user.type(screen.getByLabelText(/time/i), '09:00');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      expect(screen.getByText('Please select a future date and time')).toBeInTheDocument();
    });

    it('should pass validation with valid data', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSubmit = vi.fn().mockResolvedValue({});
      renderScheduleModal({ onSubmit });

      // Fill in valid data
      await user.type(screen.getByLabelText(/title/i), 'Valid Meeting');
      await user.type(screen.getByLabelText(/date/i), '2024-12-25');
      await user.type(screen.getByLabelText(/time/i), '14:00');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Valid Meeting',
          date: '2024-12-25',
          time: '14:00'
        }));
      });
    });

    it('should not show validation errors initially', () => {
      renderScheduleModal();

      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Date is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Time is required')).not.toBeInTheDocument();
    });

    it('should handle validation when form data is incomplete', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      // Fill only title
      await user.type(screen.getByLabelText(/title/i), 'Partial Meeting');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      // Should still show other required field errors
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByText('Time is required')).toBeInTheDocument();
      // But title error should not be shown
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data when valid', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSubmit = vi.fn().mockResolvedValue({});
      const onClose = vi.fn();
      renderScheduleModal({ onSubmit, onClose });

      // Fill in valid form data
      await user.type(screen.getByLabelText(/title/i), 'Test Meeting');
      await user.type(screen.getByLabelText(/description/i), 'Test Description');
      await user.type(screen.getByLabelText(/date/i), '2024-12-25');
      await user.type(screen.getByLabelText(/time/i), '14:00');
      await user.type(screen.getByLabelText(/location/i), 'Meeting Room');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          title: 'Test Meeting',
          description: 'Test Description',
          date: '2024-12-25',
          time: '14:00',
          duration: 60,
          location: 'Meeting Room',
          attendees: [],
          reminder: 15,
          recurring: false,
          recurrenceType: 'weekly'
        });
      });

      expect(onClose).toHaveBeenCalled();
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSubmit = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      renderScheduleModal({ onSubmit });

      // Fill in valid form data
      await user.type(screen.getByLabelText(/title/i), 'Test Meeting');
      await user.type(screen.getByLabelText(/date/i), '2024-12-25');
      await user.type(screen.getByLabelText(/time/i), '14:00');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });

    it('should handle submission errors', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
      renderScheduleModal({ onSubmit });

      // Fill in valid form data
      await user.type(screen.getByLabelText(/title/i), 'Test Meeting');
      await user.type(screen.getByLabelText(/date/i), '2024-12-25');
      await user.type(screen.getByLabelText(/time/i), '14:00');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to save schedule. Please try again.')).toBeInTheDocument();
      });

      // Should not close modal on error
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('should not submit if validation fails', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSubmit = vi.fn();
      renderScheduleModal({ onSubmit });

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should reset loading state after error', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
      renderScheduleModal({ onSubmit });

      // Fill in valid form data
      await user.type(screen.getByLabelText(/title/i), 'Test Meeting');
      await user.type(screen.getByLabelText(/date/i), '2024-12-25');
      await user.type(screen.getByLabelText(/time/i), '14:00');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to save schedule. Please try again.')).toBeInTheDocument();
      });

      // Button should be enabled again
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByText('Create Schedule')).toBeInTheDocument(); // Not "Saving..."
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      renderScheduleModal();

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have proper form labels', () => {
      renderScheduleModal();

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/recurring event/i)).toBeInTheDocument();
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      // Tab through form fields
      await user.tab();
      expect(screen.getByLabelText(/title/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/description/i)).toHaveFocus();
    });

    it('should close modal on Escape key', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const onClose = vi.fn();
      renderScheduleModal({ onClose });

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle extremely long text inputs', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const longTitle = 'a'.repeat(1000);
      const titleInput = screen.getByLabelText(/title/i);

      await user.type(titleInput, longTitle);

      expect(titleInput).toHaveValue(longTitle);
    });

    it('should handle special characters in inputs', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const specialTitle = '!@#$%^&*()[]{}|;:,.<>?';
      const titleInput = screen.getByLabelText(/title/i);

      await user.type(titleInput, specialTitle);

      expect(titleInput).toHaveValue(specialTitle);
    });

    it('should handle rapid opening and closing', () => {
      const { rerender } = renderScheduleModal({ isOpen: false });

      // Rapidly toggle open/closed
      rerender(<ScheduleModal {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      rerender(<ScheduleModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      rerender(<ScheduleModal {...defaultProps} isOpen={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle null/undefined props gracefully', () => {
      expect(() => {
        render(
          <ScheduleModal
            isOpen={true}
            onClose={null}
            onSubmit={undefined}
            initialData={null}
            mode={undefined}
          />
        );
      }).not.toThrow();
    });

    it('should handle malformed initialData', () => {
      const malformedData = {
        title: null,
        date: 'invalid-date',
        duration: 'not-a-number',
        attendees: 'not-an-array'
      };

      expect(() => {
        renderScheduleModal({ initialData: malformedData });
      }).not.toThrow();
    });

    it('should handle boundary date values', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      // Test minimum date (today)
      const today = new Date().toISOString().split('T')[0];
      const dateInput = screen.getByLabelText(/date/i);

      expect(dateInput).toHaveAttribute('min', today);
    });

    it('should handle zero and negative duration values', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderScheduleModal();

      const durationInput = screen.getByLabelText(/duration/i);

      await user.clear(durationInput);
      await user.type(durationInput, '0');

      const submitButton = screen.getByRole('button', { name: /create schedule/i });
      await user.click(submitButton);

      expect(screen.getByText('Duration must be at least 15 minutes')).toBeInTheDocument();
    });

    it('should preserve form state during re-renders', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { rerender } = renderScheduleModal();

      // Fill in some data
      await user.type(screen.getByLabelText(/title/i), 'Test Title');

      // Re-render with same props
      rerender(<ScheduleModal {...defaultProps} />);

      // Data should still be there
      expect(screen.getByLabelText(/title/i)).toHaveValue('Test Title');
    });
  });
});