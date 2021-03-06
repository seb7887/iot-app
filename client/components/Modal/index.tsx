import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Backdrop from '@material-ui/core/Backdrop'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'

import { useStyles } from './styles'

interface Props {
  title: string
  open: boolean
  onClose: () => void
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />
})

const Modal: React.FunctionComponent<Props> = ({
  title,
  open,
  onClose,
  children
}) => {
  const styles = useStyles()

  return (
    <Dialog
      aria-labelledby="modal-title"
      arial-describedby="modal-description"
      // @ts-ignore
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      closeAfterTransition
      fullWidth
      maxWidth="sm"
      scroll="paper"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
      PaperProps={{
        className: styles.root
      }}
    >
      <DialogTitle id="dialog-title" className={styles.title}>
        {title}
      </DialogTitle>
      <DialogContent className={styles.content}>{children}</DialogContent>
    </Dialog>
  )
}

export default Modal
