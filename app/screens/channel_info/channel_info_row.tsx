// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {
    Switch,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {Theme} from '@mm-redux/types/preferences';
import FastImage, {Source} from 'react-native-fast-image';
import {isValidUrl} from '@utils/url';

function createTouchableComponent(children: React.ReactNode, action: () => void) {
    return (
        <TouchableHighlight onPress={action}>
            {children}
        </TouchableHighlight>
    );
}

type Props = {
    testID?: string,
    action: () => void,
    defaultMessage: string,
    detail?: string | number | boolean,
    icon?: string,
    iconColor?: string,
    image?: Source | null,
    isLandscape?: boolean,
    rightArrow?: boolean,
    textId: string,
    togglable?: boolean,
    textColor?: string,
    theme: Theme,
    shouldRender?: boolean,
}

function channelInfoRow(props: Props) {
    const {testID, action, defaultMessage, detail, icon, iconColor, image, rightArrow, textColor, textId, togglable, theme, shouldRender} = props;

    if (!shouldRender) {
        return null;
    }

    const style = getStyleSheet(theme);

    let iconElement = null;
    if (!image) {
        iconElement = (
            <CompassIcon
                name={icon || ''}
                size={24}
                color={iconColor || changeOpacity(theme.centerChannelColor, 0.64)}
            />
        );
    } else if (image.uri) {
        iconElement = isValidUrl(image.uri) && (
            <FastImage
                source={image}
                style={{width: 24, height: 24}}
            />
        );
    }

    let actionElement = null;
    if (togglable) {
        const switchTestID = `${testID}.switch.${detail}`;
        actionElement = (
            <Switch
                testID={switchTestID}
                onValueChange={action}
                value={Boolean(detail)}
            />
        );
    } else if (rightArrow) {
        actionElement = (
            <CompassIcon
                name='chevron-right'
                size={24}
                style={style.rightIcon}
            />
        );
    }

    const RowComponent = (
        <View
            testID={testID}
            style={style.container}
        >
            {iconElement}
            <FormattedText
                style={[style.label, {color: textColor || theme.centerChannelColor}]}
                id={textId}
                defaultMessage={defaultMessage}
            />
            <Text style={style.detail}>{detail}</Text>
            {actionElement}
        </View>
    );

    if (togglable) {
        return RowComponent;
    }

    return createTouchableComponent(RowComponent, action);
}

channelInfoRow.defaultProps = {
    rightArrow: true,
    togglable: false,
    shouldRender: true,
};

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            backgroundColor: theme.centerChannelBg,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        detail: {
            marginHorizontal: 7,
            color: changeOpacity(theme.centerChannelColor, 0.5),
            fontSize: 15,
        },
        label: {
            flex: 1,
            marginLeft: 15,
            fontSize: 15,
            paddingVertical: 15,
        },
        rightIcon: {
            color: changeOpacity(theme.centerChannelColor, 0.32),
            marginRight: -4,
        },
    };
});

export default channelInfoRow;
