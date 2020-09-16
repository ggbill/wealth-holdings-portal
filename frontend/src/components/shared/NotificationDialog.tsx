import React from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import './notificationDialog.scss'
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

interface InputProps {
    isDialogOpen: boolean
    handleClose: () => void,
    type: string
    title: string
    body: string
}



const NotificationDialog = (props: InputProps) => {

    return (
        <>
            <Dialog
                open={props.isDialogOpen}
            // aria-labelledby="form-dialog-title"
            >
                <DialogTitle>
                    <div className="title-wrapper">
                        {props.type === "error" &&
                            <WarningIcon className="error" />
                        }
                        {props.type === "success" &&
                            <CheckCircleIcon className="success" />
                        }
                        {props.title}
                    </div>

                </DialogTitle>
                <DialogContent>

                    {props.body}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={props.handleClose} color="primary" variant="contained">
                        Ok
                    </Button> */}
                    <Button className="wh-button" onClick={props.handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default NotificationDialog