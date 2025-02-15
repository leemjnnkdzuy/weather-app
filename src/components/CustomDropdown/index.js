import { useState, useEffect, useRef } from "react";
import { IoChevronDownOutline, IoCheckmark } from "react-icons/io5";
import classNames from "classnames/bind";
import styles from "./CustomDropdown.module.scss";

const cx = classNames.bind(styles);

function CustomDropdown({ options, value, onChange, placeholder }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const selectedOption = options.find((option) => option.value === value);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (option) => {
		onChange(option.value);
		setIsOpen(false);
	};

	return (
		<div className={cx("dropdown")} ref={dropdownRef}>
			<div className={cx("header")} onClick={() => setIsOpen(!isOpen)}>
				<span>{selectedOption?.label || placeholder}</span>
				<IoChevronDownOutline className={cx("arrow", { open: isOpen })} />
			</div>
			<div className={cx("options", { open: isOpen })}>
				{options.map((option) => (
					<div
						key={option.value}
						className={cx("option", { selected: option.value === value })}
						onClick={() => handleSelect(option)}
					>
						<IoCheckmark className={cx("icon")} size={18} />
						{option.label}
					</div>
				))}
			</div>
		</div>
	);
}

export default CustomDropdown;
