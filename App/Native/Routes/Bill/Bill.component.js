import moment from 'moment'
import fetch from '../../../Utilities/isomorphic-fetch'
import React, { Component, PropTypes } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { capitalize } from 'lodash'

import s from './Bill.styles'
import { LabelValue, BillStatusSvg, ExternalLink, Button } from '../../Globals'

class Bill extends Component {
  constructor () {
    super()
    this.state = {
      summary: 'loading...'
    }
  }

  componentDidMount () {
    fetch('http://192.168.0.17:3001/api/v1/bill', {
      headers: { url: this.props.urls.congress }
    }).then(res => res.json())
      .then(summary => this.setState({ summary }))
      .catch(err => console.log(err))
  }

  render () {
    const {
      bill_id,
      official_title,
      introduced_on,
      last_action_at,
      chamber,
      status,
      progress,
      detailedStatus,
      sponsor,
      toggleToMyBills,
      isAdded } = this.props

    const upperId = bill_id.toUpperCase()
    const pDateIntroduced = moment(introduced_on).format('MMM D, YYYY')
    const pDateLastAction = moment(last_action_at).format('MMM D, YYYY')
    const sponsorFull = `${sponsor.title}. ${sponsor.first_name} ${sponsor.last_name}`

    return (
      <ScrollView style={s.mainContainer}>
        <View style={s.summaryContainer}>
          <Text style={s.id}>{upperId}</Text>
          <Text style={s.title}>{official_title}</Text>
          <LabelValue
            name='dateIntroduced'
            label='Introduced: '
            value={pDateIntroduced}
          />
          <LabelValue
            name='sponsor'
            label='Sponsor: '
            value={sponsorFull}
            style={{ paddingTop: 5 }}
          />
          <LabelValue
            name='chamber'
            label='Chamber: '
            value={capitalize(chamber)}
            style={{ paddingTop: 5, paddingBottom: 15 }}
          />
          <Button
            text={`${isAdded ? 'Remove From' : 'Add To'} My Bills`}
            onPress={() => toggleToMyBills(bill_id)}
            buttonStyle={{ marginBottom: 20 }}
          />
        </View>
        <View style={s.summaryContainer}>
          <Text style={s.id}>Bill Progress</Text>
          <LabelValue
            name='status'
            label='Status: '
            value={capitalize(status)}
            style={{ paddingTop: 20 }}
          />
          <LabelValue
            name='detailedStatus'
            label='Detailed Status: '
            value={detailedStatus}
            style={{ paddingTop: 5 }}
          />
          <LabelValue
            name='progress'
            label='Progress: '
            value={progress.text}
            style={{ paddingTop: 5 }}
          />
          <LabelValue
            name='lastAction'
            label='Last Action On: '
            value={pDateLastAction}
            style={{ paddingTop: 5, paddingBottom: 10 }}
          />
          <BillStatusSvg {...{ status, progress, chamber }} />
        </View>
        <View style={s.summaryContainer}>
          <Text style={s.id}>Bill Summary</Text>
          <LabelValue
            name='billSummary'
            value={this.state.summary}
            style={{ paddingTop: 15, paddingBottom: 15 }}
          />
        </View>
        <View style={s.summaryContainer}>
          <Text style={s.id}>More Info</Text>
          <ExternalLink
            text='Congress.gov'
            url={this.props.urls.congress}
          />
          <ExternalLink
            text='GovTrack.us'
            url={this.props.urls.govtrack}
            style={{ paddingBottom: 10 }}
          />
        </View>
      </ScrollView>
    )
  }
}

Bill.propTypes = {
  bill_id: PropTypes.string.isRequired,
  official_title: PropTypes.string.isRequired,
  introduced_on: PropTypes.string.isRequired,
  last_action_at: PropTypes.string.isRequired,
  chamber: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  progress: PropTypes.object.isRequired,
  detailedStatus: PropTypes.string.isRequired,
  sponsor: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
  toggleToMyBills: PropTypes.func.isRequired,
  isAdded: PropTypes.bool.isRequired
}

export default Bill
