import { Field, formPropTypes, formValueSelector, reduxForm } from 'redux-form/immutable'
import PropTypes from 'prop-types'
import { FlatButton, RaisedButton } from 'material-ui'
import React, { PureComponent } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import { ACCEPT_IMAGES } from 'models/FileSelect/FileExtension'
import TokenModel from 'models/tokens/TokenModel'
import { addToken, formTokenLoadMetaData } from 'redux/settings/erc20/tokens/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import { modalsClose } from 'redux/modals/actions'
import FileSelect from 'components/common/FileSelect/FileSelect'
import IPFSImage from 'components/common/IPFSImage/IPFSImage'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import TokenIcon from 'components/common/HashedIcon/TokenIcon'
import ProfileModel from 'models/ProfileModel'
import ModalDialog from '../ModalDialog'
import validate, { normalizeSmallestUnit } from './validate'

import './AddTokenDialog.scss'

export const FORM_ADD_TOKEN_DIALOG = 'AddTokenDialog'

const asyncValidate = (values, dispatch, props) => {
  try {
    return formTokenLoadMetaData(
      new TokenModel(values),
      dispatch,
      props,
    )
  } catch (e) {
    throw e
  }
}

function prefix (token) {
  return `components.dialogs.AddTokenDialog.${token}`
}

function mapStateToProps (state) {
  const selector = formValueSelector(FORM_ADD_TOKEN_DIALOG)
  const { account, profile } = state.get(DUCK_SESSION)
  const tokens = state.get(DUCK_TOKENS)

  return {
    address: selector(state, 'address'),
    name: selector(state, 'name'),
    icon: selector(state, 'icon'),
    symbol: selector(state, 'symbol'),
    account: account,
    profile: profile,
    isTokensLoaded: !tokens.isFetching(),
    tokens,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    modalsClose: () => dispatch(modalsClose()),
    onSubmit: (values) => {
      dispatch(modalsClose())
      dispatch(addToken(new TokenModel(values)))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: FORM_ADD_TOKEN_DIALOG, validate, asyncValidate })
export default class AddTokenDialog extends PureComponent {
  static propTypes = {
    account: PropTypes.string,
    profile: PropTypes.instanceOf(ProfileModel),
    modalsClose: PropTypes.func,
    address: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    symbol: PropTypes.string,
    ...formPropTypes,
  }

  handleClose = () => {
    this.props.modalsClose()
  }

  render () {
    return (
      <ModalDialog styleName='root'>
        <form styleName='content' onSubmit={this.props.handleSubmit}>
          <div styleName='header'>
            <div styleName='left'>
              <div styleName='icon'>
                <IPFSImage
                  styleName='iconContent'
                  multihash={this.props.icon}
                  fallbackComponent={<TokenIcon token={this.props.symbol} />}
                />
              </div>
            </div>
            <div styleName='right'>
              <div styleName='name'>{this.props.name || <Translate value={prefix('tokenNameHead')} />}</div>
              <div styleName='address'>{this.props.address || <Translate value={prefix('tokenAddressHead')} />}</div>
            </div>
          </div>
          <div styleName='body'>
            <Field
              component={TextField}
              name='address'
              fullWidth
              floatingLabelText={<Translate value={prefix('tokenContractAddress')} />}
            />
            <Field
              component={TextField}
              name='name'
              fullWidth
              floatingLabelText={<Translate value={prefix('tokenName')} />}
            />
            <Field
              component={TextField}
              name='symbol'
              fullWidth
              floatingLabelText={<Translate value={prefix('tokenSymbol')} />}
            />
            <Field
              component={TextField}
              name='decimals'
              fullWidth
              floatingLabelText={<Translate value={prefix('decimalsPlacesOfSmallestUnit')} />}
              normalize={normalizeSmallestUnit}
            />
            <Field
              component={TextField}
              name='url'
              fullWidth
              floatingLabelText={<Translate value={prefix('projectURL')} />}
            />
            <Field
              component={FileSelect}
              name='icon'
              fullWidth
              label='wallet.selectTokenIcon'
              floatingLabelText='Token icon'
              accept={ACCEPT_IMAGES}
            />
          </div>
          <div styleName='footer'>
            <FlatButton
              styleName='action'
              label={<Translate value={prefix('cancel')} />}
              onTouchTap={this.handleClose}
            />
            <RaisedButton
              styleName='action'
              label={<Translate value={prefix('save')} />}
              type='submit'
              primary
              disabled={this.props.submitting}
            />
          </div>
        </form>
      </ModalDialog>
    )
  }
}
