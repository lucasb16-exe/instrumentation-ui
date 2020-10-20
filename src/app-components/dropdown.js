import React, { useRef, useState } from 'react';
import useEventHandle from '../customHooks/useEventHandle';

const DropdownItem = ({
  onClick = () => { },
  className = '',
  children = null,
}) => (
    <button className={`dropdown-item ${className}`} onClick={onClick}>{children}</button>
  );

const Dropdown = ({
  id = 'dropdown',
  dropdownClass = [],
  buttonClass = [],
  menuClass = [],
  withToggleArrow = true,
  buttonContent = null,
  children = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const dropdownClasses = ['dropdown', ...dropdownClass].join(' ');
  const buttonClasses = ['btn', withToggleArrow && 'dropdown-toggle', ...buttonClass].join(' ');
  const menuClasses = ['dropdown-menu', isOpen && 'show', ...menuClass].join(' ');

  useEventHandle('click', menuRef, isOpen ? () => setIsOpen(false) : () => { });

  return (
    <div className={dropdownClasses} id={id}>
      <button className={buttonClasses} type='button' id={`${id}MenuButton`} title='Toggle Dropdown' onClick={() => setIsOpen(!isOpen)} aria-haspopup="true" aria-expanded={isOpen}>
        {buttonContent}
      </button>
      <div className={menuClasses} aria-labelledby={`${id}MenuButton`} ref={menuRef}>
        {children}
      </div>
    </div>
  );
}

export default {
  Menu: Dropdown,
  Item: DropdownItem,
};