import { ActionDelete, FileFileDownload } from 'material-ui/svg-icons'
import { CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import globalStyles from 'styles'
import ArbitraryNoticeModel from 'models/notices/ArbitraryNoticeModel'
import FileModel from 'models/FileSelect/FileModel'
import { download } from 'redux/ui/actions'
import { notify } from 'redux/notifier/actions'
import formatFileSize from 'utils/formatFileSize'
import FileIcon from './FileIcon'

import './FileItem.scss'

class FileItem extends PureComponent {
  static propTypes = {
    file: PropTypes.instanceOf(FileModel),
    onRemove: PropTypes.func.isRequired,
    handleDownload: PropTypes.func,
  }

  renderErrors () {
    const errors: Array = this.props.file.error()
    return errors.length > 0
      ? (
        <div styleName='errors'>
          {errors.map((item, i) => {
            const value = typeof item === 'string' ? { value: item } : item
            return <div key={i} styleName='error'><Translate {...value} /></div>
          })}
        </div>
      )
      : null
  }

  renderButtons (file: FileModel) {
    if (file.uploading()) {
      return <CircularProgress size={16} thickness={1.5} />
    }
    return (
      <div styleName='actionButtons'>
        {file.hasErrors()
          ? null
          : (
            <FileFileDownload
              styleName='buttonItem'
              onTouchTap={() => this.props.handleDownload(file.hash(), file.name())}
            />
          )
        }
        {file.hasErrors() || file.uploaded()
          ? (
            <ActionDelete
              styleName='buttonItem'
              color={file.hasErrors() ? globalStyles.colors.error : null}
              onTouchTap={() => this.props.onRemove(file.id())}
            />
          )
          : null
        }
      </div>
    )
  }

  render () {
    const file: FileModel = this.props.file

    return (
      <div styleName='root'>
        <div styleName='row'>
          <div styleName={file.hasErrors() ? 'contentWithError' : 'content'}>
            <FileIcon styleName='icon' type={file.icon()} />
            <div styleName='info'>
              <div styleName='name'>{file.name()}</div>
              <div styleName='meta'>{formatFileSize(file.size())}</div>
            </div>
          </div>
          <div styleName='action'>
            {this.renderButtons(file)}
          </div>
        </div>
        {this.renderErrors()}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleDownload: (hash, name) => {
      try {
        dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.downloads.started', params: { name } }), false))
        dispatch(download(hash, name))
        dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.downloads.completed', params: { name } }), true))
      } catch (e) {
        dispatch(notify(new ArbitraryNoticeModel({ key: 'notices.downloads.failed', params: { name } }), false))
      }
    },
  }
}

export default connect(null, mapDispatchToProps)(FileItem)
