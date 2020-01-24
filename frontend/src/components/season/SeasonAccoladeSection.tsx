import React, { useState } from "react"
import { Button, Box } from "@material-ui/core"
import AccoladeCard from "../accolade/AccoladeCard"
import ConfigureAccoladeDialog from "../accolade/ConfigureAccoladeDialog"

interface InputProps {
    auth: any
    season: App.Season
    setSeason: (season: App.Season) => void
    setIsSeasonUpdated: (isTrue: boolean) => void
}

const SeasonAccoladeSection = (props: InputProps) => {
    const { isAuthenticated } = props.auth;

    const [accoladeList, setAccoladeList] = useState<App.Accolade[]>(props.season.accoladeList)
    const [isAccoladeUpdated, setIsAccoladeUpdated] = useState<boolean>(false)
    const [isAddAccoladeDialogOpen, setIsAddAccoladeDialogOpen] = React.useState<boolean>(false);
    const [accolade, setAccolade] = React.useState<App.Accolade>({
        _id: "",
        name: "",
        imageUrl: "",
        player: {
            _id: "",
            firstName: "",
            surname: "",
            imageUrl: "",
            isActive: true
        },
        isActive: true
    })

    React.useEffect(() => {
        if (isAccoladeUpdated) {
            props.setSeason({ ...props.season, accoladeList: accoladeList })
            setIsAccoladeUpdated(false)
            props.setIsSeasonUpdated(true)
        }
        // props.setIsSeasonUpdated(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAccoladeUpdated]);


    const deleteAccolade = (id): void => {
        var updatedList = accoladeList.filter(accolade =>
            accolade._id !== id
        );
        setAccoladeList(updatedList)
        setIsAccoladeUpdated(true)
    }

    const updateAccoladeList = (accolade: App.Accolade): void => {

        const updatedAccoladeList = props.season.accoladeList.map(obj => {
            if (obj._id === accolade._id) {
                return accolade;
            } else {
                return obj
            }
        })

        setAccoladeList(updatedAccoladeList);
        setIsAccoladeUpdated(true)
    }

    const addNewAccolade = (accolade: App.Accolade) => {
        props.season.accoladeList.push(accolade)
        setAccoladeList(props.season.accoladeList);
        setIsAccoladeUpdated(true)
    }

    const updateAccolade = (accolade: App.Accolade) => {
    }

    const handleAddAccoladeDialogOpen = () => {
        setIsAddAccoladeDialogOpen(true)
    };

    const handleAddAccoladeDialogClose = () => {
        setIsAddAccoladeDialogOpen(false)
        setAccolade({
            _id: "",
            name: "",
            imageUrl: "",
            player: {
                _id: "",
                firstName: "",
                surname: "",
                imageUrl: "",
                isActive: true
            },
            isActive: true
        })
    };

    return (
        <>
            <div style={{ display: accoladeList.length ? 'block' : 'none' }}>
                <h2>Accolades</h2>
                <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly">
                    {accoladeList.map(accolade => {
                        return (
                            <div className="accolade-card-div" key={accolade._id}>
                                <AccoladeCard
                                    accolade={accolade}
                                    auth={props.auth}
                                    deleteAccolade={deleteAccolade}
                                    updateAccoladeList={updateAccoladeList}
                                    playerList={props.season.playerList}
                                />
                            </div>
                        )
                    })}
                </Box>
                {isAuthenticated() &&
                    <Button onClick={handleAddAccoladeDialogOpen} color="primary">
                        Add
                </Button>
                }
                <br />
            </div>
            <div style={{ display: isAuthenticated() && !accoladeList.length ? 'block' : 'none' }}>
                <h2>Accolades</h2>
                {isAuthenticated() &&
                    <Button onClick={handleAddAccoladeDialogOpen} color="primary">
                        Add
                    </Button>
                }
                <br />
            </div>

            {/* Add Accolade Dialog */}
            <ConfigureAccoladeDialog
                handleClose={handleAddAccoladeDialogClose}
                updateAccolade={updateAccolade}
                createAccolade={addNewAccolade}
                isDialogOpen={isAddAccoladeDialogOpen}
                accolade={accolade}
                isCreateAccoladeDialog={true}
                playerList={props.season.playerList}
            />
        </>
    )

}

export default SeasonAccoladeSection