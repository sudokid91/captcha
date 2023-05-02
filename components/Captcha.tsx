import { useState } from "react";

interface IProps{
	toggleSelected: (idx: number) => void;
	selectedIndexes: Array<number>;
	captchaKey: any;
}

const Captcha = (props: IProps) => {
	const { toggleSelected, selectedIndexes, captchaKey} = props;
	const imageLocations = (new Array(9))
														.fill(null)
														.map((item, index) => {
			return `/api/captcha-image?index=${index}&key=${captchaKey}`;
	});

	const onToggle = (idx: number) => {
		toggleSelected && toggleSelected(idx);
	}

	return (
	<div className="captcha">
		<h2>select all dogs:</h2>
			<div className="captcha-image">
				{imageLocations.map((imageUrl: string, index: number) => (
					<div 
						onClick={() => onToggle(index) }
						className={selectedIndexes.includes(index) ? 'selected' : ''}
						key={`${index}`}>
							<img src={imageUrl} alt="" />
						</div>
				))}
			</div>
	</div>);
};

export default Captcha;
