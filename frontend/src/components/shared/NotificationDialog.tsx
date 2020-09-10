import React from "react"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";

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
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    {props.body}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default NotificationDialog