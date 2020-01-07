import React, {useState} from "react"
import './accolade.scss'
import { Card, CardContent, CardMedia, Button, CardActions } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ConfigureAccoladeDialog from "./ConfigureAccoladeDialog"

interface InputProps {
    accolade: App.Accolade,
    auth: any,
    deleteAccolade: (id: string) => void,
    updateAccoladeList: (accolade: App.Accolade) => void,
    playerList: App.Player[]
}

const AccoladeCard = (props: InputProps) => {

    const { isAuthenticated } = props.auth;
    const [isEditAccoladeDialogOpen, setIsEditAccoladeDialogOpen] = useState<boolean>(false);
    const [accolade, setAccolade] = useState<App.Accolade>({ ...props.accolade })

    const deleteAccolade = (id) => {
        props.deleteAccolade(id)
    }

    const updateAccolade = (accolade: App.Accolade) => {
        // console.log(`update accolade: ${JSON.stringify(accolade)}`)
        props.updateAccoladeList(accolade);
        // setAccolade(accolade)
    }

    const createAccolade = (accolade: App.Accolade) => {
    }

    const handleEditAccoladeDialogOpen = () => {
        setIsEditAccoladeDialogOpen(true)
    };

    const handleEditAccoladeDialogClose = () => {
        setIsEditAccoladeDialogOpen(false)
    };

    return (
        <>
            <div className="accolade-card">
                <Card>
                    <CardMedia
                        className="player-image"
                        image={props.accolade.player.imageUrl ? props.accolade.player.imageUrl : require("../../images/placeholder_image_logo.png")}
                        title={props.accolade.name}
                    />
                    <CardContent>
                        <img className="accolade-overlay-image" src={props.accolade.imageUrl ? props.accolade.imageUrl : require("../../images/placeholder_accolade_icon.png")} />
                        <span className="title">{props.accolade.player.firstName} {props.accolade.player.surname}</span>
                        <span className="subtitle">{props.accolade.name}</span>
                    </CardContent>
                    {isAuthenticated() &&
                        <CardActions>
                            <Button variant="text" onClick={() => handleEditAccoladeDialogOpen()}>
                                <EditIcon />
                            </Button>
                            <Button variant="text" onClick={() => deleteAccolade(props.accolade._id)}>
                                <DeleteIcon />
                            </Button>
                        </CardActions>
                    }
                </Card>
            </div>
            {/* Edit Accolade Dialog */}
            <ConfigureAccoladeDialog
                handleClose={handleEditAccoladeDialogClose}
                updateAccolade={updateAccolade}
                createAccolade={createAccolade}
                isDialogOpen={isEditAccoladeDialogOpen}
                accolade={props.accolade}
                isCreateAccoladeDialog={false}
                playerList={props.playerList}
            />
        </>
    )
}

export default AccoladeCard