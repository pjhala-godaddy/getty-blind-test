import '../styles/CommentBox.css';

interface CommentBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function CommentBox({ value, onChange, placeholder }: CommentBoxProps) {
  return (
    <div className="comment-box">
      <div className="comment-label">Comments (Optional)</div>
      <textarea
        className="comment-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Add any notes...'}
      />
    </div>
  );
}

export default CommentBox;

