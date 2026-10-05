export const UserAvatar = ({ img }: { img?: string }) =>
  img ? (
    <img src={img} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
  ) : (
    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd' }} />
  );
