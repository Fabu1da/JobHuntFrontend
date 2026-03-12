import { useFilterContext } from "../hooks/useContext";

export const ErrorSection = () => {
  const { error } = useFilterContext();
  return (
    <div>
          {error && (
        <div className="error-msg">
          <strong>Backend not running.</strong> Start the server first:<br />
          <code style={{ fontFamily: 'monospace', fontSize: 12 }}>
            cd backend && pip install -r requirements.txt && python app.py
          </code>
        </div>
      )}
    </div>
  )
}
