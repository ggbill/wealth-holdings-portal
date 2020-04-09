import React from 'react'
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Button from "@material-ui/core/Button"
import '../../App.scss'
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    root: {
      color: 'white',
    },
  });

const LinkButton = (props) => {
  const {
    history,
    location,
    match,
    staticContext,
    to,
    onClick,
    // ⬆ filtering out props that `button` doesn’t know what to do with.
    ...rest
  } = props

  const classes = useStyles();

  return (
    // <Button className={classes.root}
    <Button variant="text" className={classes.root}
      {...rest} // `children` is just another prop!
      onClick={(event) => {
        onClick && onClick(event)
        history.push(to)
      }}
    />
  )
}

export default withRouter(LinkButton)