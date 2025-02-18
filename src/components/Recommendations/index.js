import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";
import styles from "./Recommendations.module.scss";

const cx = classNames.bind(styles);

function Recommendations({ recommendations }) {
	const { t } = useTranslation();

	return (
		<div className={cx("recommendations")}>
			<div className={cx("recommendations-header")}>
				<h3 className={cx("recommendations-title")}>
					{t("airQualityRanking.recommendations.health")}
				</h3>
				<h3 className={cx("recommendations-subtitle")}>
					{t("airQualityRanking.recommendations.description")}
				</h3>
			</div>
			<div className={cx("recommendations-list")}>
				{Object.entries(recommendations.pollution).map(([key, value], index) => (
					<div key={key} className={cx("recommendation-item", value.value)}>
						<div className={cx("recommendation-number")}>{index + 1}</div>
						<p>{value.text}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default Recommendations;
