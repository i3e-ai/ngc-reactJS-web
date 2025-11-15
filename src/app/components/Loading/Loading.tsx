import './Loading.css';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ 
  message = "Loading...", 
  fullScreen = false 
}: LoadingProps) {
  return (
    <div className={fullScreen ? 'loading loading--fullscreen' : 'loading'}>
      <div className="loading__spinner"></div>
      <p className="loading__message">{message}</p>
    </div>
  );
}