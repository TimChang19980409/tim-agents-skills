type ProfileDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function ProfileDialog({ open, onClose }: ProfileDialogProps) {
  if (!open) return null;

  return (
    <div role="dialog">
      <h2>Edit profile</h2>
      <input placeholder="Display name" />
      <button onClick={onClose}>X</button>
      <button>Save</button>
    </div>
  );
}
