import SignaturesList from 'components/wallet/SignaturesList/SignaturesList'
import { RaisedButton } from 'material-ui'
import React, { Component } from 'react'
import { Translate } from 'react-redux-i18n'
import { Field, formPropTypes, reduxForm } from 'redux-form/immutable'
import './EditSignaturesForm.scss'
import { prefix } from './lang'
import validate from './validate'

export const FORM_EDIT_SIGNATURES = 'FormEditSignatures'

const onSubmit = (values) => values.get('requiredSignatures')

@reduxForm({ form: FORM_EDIT_SIGNATURES, validate, onSubmit })
export default class EditSignaturesForm extends Component {
  static propTypes = {
    ...formPropTypes,
  }

  render () {
    const { handleSubmit, pristine, valid, initialValues } = this.props

    return (
      <form styleName='root' onSubmit={handleSubmit}>
        <div styleName='header'>
          <Translate value={`${prefix}.dialogTitle`} />
        </div>
        <div styleName='body'>
          <div styleName='description'>
            <Translate value={`${prefix}.description`} />
          </div>
          <div styleName='field'>
            <Field
              component={SignaturesList}
              name='requiredSignatures'
              count={initialValues.get('ownersCount')}
            />
          </div>
          <div styleName='action'>
            <RaisedButton
              label={<Translate value={`${prefix}.submit`} />}
              type='submit'
              primary
              disabled={pristine || !valid}
            />
          </div>
        </div>
      </form>
    )
  }
}
