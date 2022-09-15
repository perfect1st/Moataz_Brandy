import React from 'react';
import {
    View,
    Text,
    Modal,
    FlatList,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

const DefaultRowHeight = 35.0;

class Dropdown extends React.Component {
    constructor(props) {
        super(props);

        const { options, selected, style } = this.props;
        this.state = {
            modalVisible: false,
            arrItems: options || [],
            selectedItem: selected || {},
            modalW: style.width,
            modalH: style.height,
            bottomY: 0,
            modalY: 0,
        };

        this.viewSelect = React.createRef();
        this.spinValue = new Animated.Value(0);
    }

    static getDerivedStateFromProps(props, state) {
        if (state.arrItems !== props.options) {
            return {
                arrItems: props.options,
                selectedItem: props.selected,
                modalW: props.style.width,
                modalH: props.style.height,
            }
        } else {
            return state;
        }
    }

    toggleModal = () => {
        const { showBelow, maxVisible, options, rowStyle, separatorStyle, minVerticalGap } = this.props;

        if (options.length > 0) {
            this.viewSelect.measure((originX, originY, width, height, pageX, pageY) => {
                const minGap = minVerticalGap || 30;
                const visibleRows = Math.min(maxVisible, options.length);
                const screenHeight = Dimensions.get("window").height;

                const rowHeight = rowStyle.height || DefaultRowHeight;
                const separatorHeight = separatorStyle.height || styles.viewSeparator.height;
                const modalHeight = visibleRows * (separatorHeight + rowHeight);
                let modalOffsetY = pageY - ((modalHeight / 2) - (height / 2));

                if (showBelow) {
                    modalOffsetY = pageY + height;
                }

                let bottomSpace = screenHeight - (modalOffsetY + modalHeight);

                if (bottomSpace < minGap) {
                    modalOffsetY = showBelow ? (pageY - modalHeight) : (screenHeight - minGap);
                }
                if (modalOffsetY < minGap) {
                    modalOffsetY = minGap;
                }

                bottomSpace = screenHeight - (modalOffsetY + modalHeight);

                this.setState(prevState => ({
                    modalVisible: !prevState.modalVisible,
                    modalW: width,
                    modalH: modalHeight,
                    modalY: modalOffsetY,
                    bottomY: bottomSpace,
                }), () => {
                    this.animateArrow(1);
                });
            });
        }
    }

    animateArrow = (val) => {
        Animated.timing(this.spinValue, {
            toValue: val,
            useNativeDriver: true,
            duration: 200,
        }).start();
    }

    fieldClicked = () => {
        const { disabled } = this.props;
        const isEnabled = (disabled === undefined || disabled === false);

        if (isEnabled) {
            this.toggleModal();
        }
    }

    itemClicked = (item, index) => {
        const { onSelectItem } = this.props;

        this.setState({ selectedItem: item }, () => {
            this.animateArrow(0);
            setTimeout(() => {
                this.setState({ modalVisible: false }, () => {
                    const props = {
                        onSelectItem: onSelectItem(item, index)
                    }
                    PropTypes.checkPropTypes(propTypes, props, 'onSelectItem', 'Dropdown');
                });
            }, 200);
        });
    }

    renderModal = () => {
        const { modalVisible, arrItems, selectedItem, bottomY, modalY, modalW, modalH } = this.state;
        const { rowKeyExtractor, rowValueExtractor, overlayStyle, separatorStyle, rowStyle, selectedRowStyle, rowTextStyle, selectedRowTextStyle, onDropdownClose } = this.props;

        return (
            <Modal
                animationType={'fade'}
                visible={modalVisible}
                transparent={true}
                style={styles.modal}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => {
                        onDropdownClose();
                        this.animateArrow(0);
                        this.setState({ modalVisible: false });
                    }}>
                        <View>
                            <View
                                style={[
                                    styles.modalContent,
                                    {
                                        marginBottom: bottomY,
                                        marginTop: modalY,
                                        width: modalW,
                                        height: modalH,
                                    },
                                    overlayStyle
                                ]}>
                                <FlatList
                                    data={arrItems}
                                    style={[
                                        styles.listContent,
                                        { borderRadius: styles.modalContent.borderRadius },
                                        { borderRadius: overlayStyle.borderRadius },
                                    ]}
                                    keyboardShouldPersistTaps={'always'}
                                    keyExtractor={(item, index) => {
                                        return rowKeyExtractor(item, index);
                                    }}
                                    ItemSeparatorComponent={() => {
                                        return <View style={[
                                            styles.viewSeparator,
                                            separatorStyle
                                        ]} />
                                    }}
                                    renderItem={({ item, index }) => {
                                        const displayText = rowValueExtractor(item, index);
                                        const isSelected = item === selectedItem;

                                        return <TouchableOpacity activeOpacity={0.8}
                                            onPress={() => this.itemClicked(item, index)}>
                                            <View style={[
                                                isSelected ? styles.selectedRow : styles.viewRow,
                                                isSelected ? selectedRowStyle : rowStyle,
                                            ]}>
                                                <Text style={[
                                                    isSelected ? styles.selectedRowText : styles.rowText,
                                                    isSelected ? selectedRowTextStyle : rowTextStyle,
                                                ]}>
                                                    {displayText}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    }} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>
        )
    }

    render() {
        const { modalVisible, arrItems, selectedItem } = this.state;
        const { disabled, style, defaultText, inputTextStyle, rowValueExtractor } = this.props;
        const index = arrItems.indexOf(selectedItem);
        let selectedText = rowValueExtractor(selectedItem, index);
        selectedText = selectedText.length > 0 ? selectedText : defaultText;
        const isEnabled = (disabled === undefined || disabled === false);
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '0deg']
        });

        return (
            <View style={[style,
                {
                    borderColor: isEnabled ? style.borderColor : 'lightgray'
                }]}
                ref={(input) => { this.viewSelect = input }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.fieldClicked()}
                    style={[
                        styles.btnToggle,
                        style.height ? { flex: 1 } : {}
                    ]}>
                    <Text style={[
                        styles.inputText,
                        inputTextStyle,
                        { color: isEnabled ? inputTextStyle.color : 'lightgray' }
                    ]}>
                        {selectedText}
                    </Text>
                    <Animated.View style={[styles.imgIcon, styles.triangle, {
                        borderBottomColor: isEnabled ? 'gray' : 'lightgray',
                    }, { transform: [{ rotateX: spin }] }]} >
                    </Animated.View>
                </TouchableOpacity>
                {this.renderModal()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    modalContent: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: 'white',
    },
    listContent: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    viewSeparator: {
        height: 1,
        backgroundColor: 'rgb(220,220,220)'
    },
    viewRow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        paddingVertical: 8,
    },
    selectedRow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'gray',
        paddingVertical: 8,
    },
    rowText: {
        textAlign: 'left',
        fontSize: 13,
        marginHorizontal: 15,
        color: 'gray',
    },
    selectedRowText: {
        textAlign: 'left',
        fontSize: 13,
        marginHorizontal: 15,
        color: 'white',
    },
    btnToggle: {
        width: '100%',
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 13,
        marginLeft: 10,
        color: 'blue',
        marginRight: 35,
        lineHeight: 30,
    },
    imgIcon: {
        position: 'absolute',
        right: 15,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'gray'
    }
});

const propTypes = {
    options: PropTypes.array,
    disabled: PropTypes.bool,
    showBelow: PropTypes.bool,
    selected: PropTypes.object,
    onSelectItem: PropTypes.func,
    defaultText: PropTypes.string,
    onDropdownClose: PropTypes.func,
    rowKeyExtractor: PropTypes.func,
    rowValueExtractor: PropTypes.func,
    maxVisible: PropTypes.number,
    minVerticalGap: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    rowStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    selectedRowStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    rowTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    selectedRowTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    separatorStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    overlayStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
    inputTextStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
};

const defaultProps = {
    showBelow: false,
    maxVisible: 3,
    minVerticalGap: 30,
    style: {
        alignSelf: 'stretch',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 3,
        backgroundColor: 'white',
        height: '35',
    },
    rowStyle: {
        height: 35,
        backgroundColor: 'white',
    },
    selectedRowStyle: {
        height: 35,
        backgroundColor: 'gray',
    },
    rowTextStyle: {
        fontSize: 14,
        marginLeft: 15,
        color: 'gray',
    },
    selectedRowTextStyle: {
        fontSize: 14,
        marginLeft: 15,
        color: 'white',
    },
    separatorStyle: {
        height: 1,
    },
    overlayStyle: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    inputTextStyle: {
        fontSize: 14,
        marginLeft: 15,
        color: 'black',
    }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
