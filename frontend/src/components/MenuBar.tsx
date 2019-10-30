import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import LinkButton from './LinkButton';
import { ReactComponent as LightningSVG } from '../images/lightning-logo.svg';
import { Link } from 'react-router-dom'


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: '#E4FF1A',
            color: '#84A07C'
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        linkButton: {
            color: 'black',
            fontFamily: 'Quicksand, sans-serif',
            fontWeight: 'bold',
            "&:hover": {
                backgroundColor: "#E4FF1A",
                color: '#84A07C'
            }
        },
        toolbar: {
            justifyContent: 'space-between'
        },
        logo: {
            height: 45,
            width: 45
        }
    }),
);

const MenuBar = () => {

    const classes = useStyles();
    return (
        <>
            <div className={classes.root}>
                <AppBar className={classes.root} position="static">
                    <Toolbar className={classes.toolbar}>
                        <Link to={'/'}>
                        <LightningSVG className={classes.logo} />
                        </Link>
                        
                        <div className="menu-items">
                            {/* <LinkButton className={classes.linkButton} to='/'>Home</LinkButton> */}
                            <LinkButton className={classes.linkButton} to='/season-admin'>Seasons</LinkButton>
                            <LinkButton className={classes.linkButton} to='/teams'>Teams</LinkButton>
                            <LinkButton className={classes.linkButton} to='/players'>Players</LinkButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        </>
    )
}

export default MenuBar