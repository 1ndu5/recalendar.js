import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES } from '~/lib/itinerary-utils';

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create( {
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			fontWeight: 'bold',
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
		timeblockRow: {
			flexDirection: 'row',
			borderBottom: '1 solid #AAA',
			height: 20,
			minHeight: 20,
		},
		timeblockTime: {
			fontSize: 10,
			fontWeight: 'bold',
			textAlign: 'right',
			borderRight: '1 solid black',
			padding: '2 3 0 3',
			justifyContent: 'center',
		},
		timeblockCol: {
			borderRight: '1 solid #AAA',
			padding: '0 4',
		},
		timeblockNotes: {
			padding: '0 4',
		},
	} );

	getTimeblockColumns() {
		const columns = this.props.timeblockColumns;
		if ( ! columns || columns.length !== 4 ) {
			return null;
		}
		return columns;
	}

	renderItineraryItem = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );

			case ITINERARY_LINES:
			default:
				return this.renderLines( value );
		}
	};

	renderTimeblockItineraryItem = ( { type, value }, index ) => {
		const columns = this.getTimeblockColumns();
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderTimeblockRow( value, `item-${ index }`, columns );

			case ITINERARY_LINES:
			default:
				return this.renderTimeblockLines( value, columns );
		}
	};

	renderItem( text, index ) {
		return (
			<Text key={ index } style={ this.styles.line }>
				{text}
			</Text>
		);
	}

	renderLines( count ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	renderTimeblockRow( text, key, columns ) {
		return (
			<View key={ key } style={ this.styles.timeblockRow }>
				<View style={ [ this.styles.timeblockTime, { width: `${ columns[ 0 ] }%` } ] }>
					<Text>{text}</Text>
				</View>
				<View style={ [ this.styles.timeblockCol, { width: `${ columns[ 1 ] }%` } ] } />
				<View style={ [ this.styles.timeblockCol, { width: `${ columns[ 2 ] }%` } ] } />
				<View style={ [ this.styles.timeblockNotes, { width: `${ columns[ 3 ] }%` } ] } />
			</View>
		);
	}

	renderTimeblockLines( count, columns ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( this.renderTimeblockRow( '', `line-${ i }`, columns ) );
		}
		return lines;
	}

	render() {
		const columns = this.getTimeblockColumns();
		if ( columns ) {
			return <>{this.props.items.map( this.renderTimeblockItineraryItem )}</>;
		}
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
	timeblockColumns: PropTypes.array,
};

Itinerary.defaultProps = {
	timeblockColumns: null,
};

export default Itinerary;
