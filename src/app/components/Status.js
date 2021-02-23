import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { dispatchRemotely } from 'remotedev-app/lib/actions';
import * as themes from 'redux-devtools-themes';

class Status extends Component {
  static defaultProps = {
    theme: 'nicinabox'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      basePrice: 0
    };
  }

  componentWillReceiveProps() {
    this.handlePrice();
  }

  getTheme() {
    let { theme } = this.props;
    if (typeof theme !== 'string') {
      return theme;
    }

    if (typeof themes[theme] !== 'undefined') {
      return themes[theme];
    }

    return themes.nicinabox;
  }

  handlePrice() {
    const { instances: { states }, current } = this.props;
    const computedStates = states[current].computedStates || [];
    const {
      publicInfo: {
        secStagePubInfo: {
          priceUpper
        } = {}
      } = {},
      system: {
        webBidDialogCount = 0
      } = {}
    } = computedStates[computedStates.length - 1] ? computedStates[computedStates.length - 1].state : {};

    const curPrice = parseInt(priceUpper, 0);
    // { type: 'bidBase/initBidding', payload: 87900 }

    if (webBidDialogCount === 1 && curPrice > 0) {
      this.props.dispatch(`{ type: \'bidBase/initBidding\', payload: ${curPrice} }`);
    }
  }

  render() {
    const theme = this.getTheme();
    const { instances: { states }, current } = this.props;
    const computedStates = states[current].computedStates || [];
    const { publicInfo: {
      secStagePubInfo: {
        priceUpper = 0,
        sysTime
      } = {}
    } = {}} = computedStates[computedStates.length - 1] ? computedStates[computedStates.length - 1].state : {};

    return (
      <div
        style={{
          background: theme
        }}
      >
        <p>
        <span>参考价格： {priceUpper}</span> <span>系统时间：{sysTime}</span>
        </p>
        <button onClick={this.handlePrice.bind(this)}>TEST</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    instances: state.instances,
    current: state.instances.current
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: bindActionCreators(dispatchRemotely, dispatch),
  };
}

Status.propTypes = {
  instances: PropTypes.object.isRequired,
  current: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  theme: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ])
};

export default connect(mapStateToProps, mapDispatchToProps)(Status);
