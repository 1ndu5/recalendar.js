import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';

import {
	findByDate,
	DATE_FORMAT as SPECIAL_DATES_DATE_FORMAT,
} from '~/lib/special-dates-utils';
import Header from '~/pdf/components/header';
import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import {
	dayPageLink,
	nextDayPageLink,
	previousDayPageLink,
	monthOverviewLink,
} from '~/pdf/lib/links';
import { content, pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class DayPage extends React.Component {
	styles = StyleSheet.create(
		Object.assign(
			{},
			{
				content,
				page: pageStyle( this.props.config ),
				shutdownRow: {
					flexDirection: 'row',
					justifyContent: 'flex-end',
					alignItems: 'center',
					paddingRight: 5,
					paddingBottom: 2,
				},
				shutdownText: {
					fontSize: 10,
					fontStyle: 'italic',
					marginRight: 5,
				},
				shutdownBox: {
					width: 12,
					height: 12,
					border: '1 solid black',
				},
			},
		),
	);

	renderExtraItems = ( items, index ) => (
		<Page key={ index } size={ this.props.config.pageSize } dpi={ this.props.config.dpi }>
			<View style={ this.styles.page }>
				<Itinerary
					items={ items }
					timeblockColumns={ this.props.config.timeblockColumns }
				/>
			</View>
		</Page>
	);

	renderShutdownCheckbox() {
		const { config, date } = this.props;
		const { shutdownCheckbox } = config;
		if (
			! shutdownCheckbox
			|| ! shutdownCheckbox.text
			|| ! shutdownCheckbox.days
			|| shutdownCheckbox.days.length === 0
		) {
			return null;
		}

		const currentDayOfWeek = date.day();
		if ( ! shutdownCheckbox.days.includes( currentDayOfWeek ) ) {
			return null;
		}

		return (
			<View style={ this.styles.shutdownRow }>
				<Text style={ this.styles.shutdownText }>{shutdownCheckbox.text}</Text>
				<View style={ this.styles.shutdownBox } />
			</View>
		);
	}

	render() {
		const { date, config } = this.props;
		const { items, isEnabled } = config.dayItineraries[ date.weekday() ];
		if ( ! isEnabled ) {
			return null;
		}
		const itemsByPage = splitItemsByPages( items );

		const specialDateKey = this.props.date.format( SPECIAL_DATES_DATE_FORMAT );
		const specialItems = this.props.config.specialDates.filter(
			findByDate( specialDateKey ),
		);
		return (
			<>
				<Page id={ dayPageLink( date, config ) } size={ config.pageSize } dpi={ config.dpi }>
					<View style={ this.styles.page }>
						<Header
							isLeftHanded={ config.isLeftHanded }
							title={ date.format( 'MMMM' ) }
							titleLink={ '#' + monthOverviewLink( date, config ) }
							subtitle={ date.format( 'dddd' ) }
							number={ date.format( 'DD' ) }
							previousLink={ '#' + previousDayPageLink( date, config ) }
							nextLink={ '#' + nextDayPageLink( date, config ) }
							calendar={ <MiniCalendar date={ date } config={ config } /> }
							specialItems={ specialItems }
						>
							{this.renderShutdownCheckbox()}
						</Header>
						<View style={ this.styles.content }>
							<Itinerary
								items={ itemsByPage[ 0 ] }
								timeblockColumns={ config.timeblockColumns }
							/>
						</View>
					</View>
				</Page>
				{itemsByPage.slice( 1 ).map( this.renderExtraItems )}
			</>
		);
	}
}

DayPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default DayPage;
