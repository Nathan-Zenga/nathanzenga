const MediaSetLayout = ({ children, applyGridCSS }) => {
  if (applyGridCSS) return (
    <div className="container media-set">
      <div className="grid-container">
        <div className="grid">
          {children}
        </div>
      </div>
    </div>
  );

  return <div className="container media-set">{children}</div>;
}

MediaSetLayout.defaultProps = { applyGridCSS: false }

export default MediaSetLayout;
