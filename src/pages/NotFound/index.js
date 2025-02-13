import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import NotificationBanner from "../../components/NotificationBanner";
import styles from "./NotFound.module.scss";

const cx = classNames.bind(styles);

function NotFound() {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleBackHome = () => {
		navigate("/");
	};

	return (
		<div className={cx("wrapper")}>
			<div className={cx("content")}>
				<NotificationBanner
					type="error"
					message={
						<div>
							<h2>{t("notFound.title")}</h2>
							<p>{t("notFound.description")}</p>
							<button className={cx("button")} onClick={handleBackHome}>
								{t("notFound.button")}
							</button>
						</div>
					}
				/>
			</div>
		</div>
	);
}

export default NotFound;
