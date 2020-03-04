import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { EventProvider } from '../context/EventContext'
import { AnsweredProvider } from '../context/AnsweredContext'
import { SkipProvider } from '../context/SkipContext'
import Header from './header'
import EventItem from './events/EventItem'
import { ScoreProvider } from '../context/ScoreContext'

const HomePage = withRouter(() => (
  <Grid container direction="row" justify="flex-start" alignItems="center">
    <Grid item xs={12}>
      <Header />
    </Grid>
    <Grid item xs={12}>
      <Switch>
        <Route
          path="/event/:id"
          render={() => (
            <EventProvider>
              <AnsweredProvider>
                <SkipProvider>
                  <ScoreProvider>
                    <EventItem />
                  </ScoreProvider>
                </SkipProvider>
              </AnsweredProvider>
            </EventProvider>
          )}
        />
      </Switch>
    </Grid>
  </Grid>
))

export default HomePage
