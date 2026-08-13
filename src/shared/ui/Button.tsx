type ButtonProps = {
  text: string;
  className?: string;
  id?: string;
};

const handleClick = (event: React.MouseEvent, id?: string) => {
  event.preventDefault();

  const target = document.getElementById('projects');

  if (target && id) {
    const top = target.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

const Button = ({ text, className, id }: ButtonProps) => {
  return (
    <a href="#" onClick={event => handleClick(event, id)} className={`${className ?? ''} cta-wrapper`}>
      <div className="cta-button group">
        <div className="bg-circle" />
        <p className="text">{text}</p>
        <div className="arrow-wrapper">
          <img src="/images/arrow-down.svg" alt="arrow" />
        </div>
      </div>
    </a>
  );
};

export default Button;
