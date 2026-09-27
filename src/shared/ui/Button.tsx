import type { AnchorHTMLAttributes } from 'react';

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { text: string };

const Button = ({ text, className, ...rest }: ButtonProps) => {
  return (
    <a {...rest} className={`${className ?? ''} cta-wrapper`}>
      <div className="cta-button group">
        <div className="bg-circle" />
        <p className="text">{text}</p>
        <div className="arrow-wrapper">
          <img src="/images/arrow-down.svg" alt="" />
        </div>
      </div>
    </a>
  );
};

export default Button;
