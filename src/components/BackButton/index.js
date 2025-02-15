import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./BackButton.module.scss";

const cx = classNames.bind(styles);

function BackButton() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<button className={cx("back-button")} onClick={handleBack}>
			<IoArrowBack className={cx("back-icon")} />
			<span className={cx("back-text")}>{t("common.back")}</span>
		</button>
	);
}

export default BackButton;
