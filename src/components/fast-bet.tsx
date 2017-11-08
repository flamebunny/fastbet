import * as React from 'react'
import * as Moment from 'moment'
import * as Rx from 'rx'
import { observe } from './HOCs'
import { getCurrentTime } from '../helpers'

var classNames = require('classnames');

const style = require('../styles/app.scss')

enum JockeyGenderType {
  Unknown = 1,
  Male,
  Female,
}

interface IFastRunner {
    silkIndex: number,
    acceptorName: string,
    acceptorNumber: number,
    barrier: number,
    fixedOdds: number,
    toteOdds: number,
    jockey: string,
    jockeyGender: JockeyGenderType,
    isScratched: boolean,
    emergencyNumber?: number,
    silkImage: { cssurl: string, url: string, width: number},
}

interface IHeader {
    raceCourse: string,
    raceNumber: number,
    distance: number,
    raceTime: Date,
}

interface IFastRunners {
  Items: { [id: number]: IFastRunner }
}

export class FastBet extends React.Component<{date: Date}, {}> {
  public render() {

    const fastRunnerData = CreateDummyList()
    const headerData = CreateDummyHeader()

    return <div>
      <div style={{position: 'fixed', top: '0px', width: '100%'}}>
        <RaceHeader header={headerData} />
        <Selections />
        <StarterHeader />
      </div>
      <div style={{position: 'static', marginTop: '180px', width: '100%'}}>
        <FastRunnersList runners={fastRunnerData} />
      </div>
    </div>
  }
}

const RaceHeader = ({header}: {header: IHeader}) => (
    <div className='l-faux-table w100'>
        <div className='l-faux-row'>
            <div className='l-faux-cell' style={{backgroundColor: '#542D6B', color: '#fff', width: '100%',
                whiteSpace: 'nowrap', fontSize: '14px', fontWeight: 'bold', paddingBottom: '4px', paddingTop: '4px', textAlign: 'center' }}>
                {header.raceCourse.toUpperCase()}: R{header.raceNumber}
            </div>
        </div>

        <div className='l-faux-row'>
            <div className='l-faux-cell'>
                <div className='l-faux-table w100' style={{backgroundColor: '#000', color:'#fff'}}>
                    <div className='l-faux-row fz-12' style={{paddingBottom: '4px', paddingTop: '4px'}}>
                        <div className='l-faux-cell text-left'>
                            { getRaceCountDownComponent(header.raceTime) }
                        </div>
                        <div className='l-faux-cell text-left'>
                            {FormatDate(header.raceTime, 'DD/MM/YYYY HH:mm')}
                        </div>
                        <div className='l-faux-cell text-right'>{header.distance}m</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
)

const StarterHeader = () => (
    <div className='l-faux-table w100'>
        <div className='l-faux-row'>
            <div className='l-faux-cell'>
                <div className='l-faux-table w100' style={{backgroundColor: '#fff'}}>
                    <div className='l-faux-row fz-12 w100' style={{paddingBottom: '4px', paddingTop: '8px'}}>
                        <div className='l-faux-cell text-right'>
                            <span style={{textAlign: 'center', whiteSpace: 'nowrap', color: '#2b7d84', padding: '6px'}}>FIXED</span>
                            <span style={{textAlign: 'center', whiteSpace: 'nowrap', color: '#380982', padding: '6px'}}>TOTE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const Selections = () => (
  <div className='l-faux-table w100' style={{padding: '8px 26px', backgroundColor:'#eeeeee', border: '1px solid #dedede'}}>
    <div className='l-faux-row'>
      <div className='l-faux-cell' style={{textAlign: 'center'}}>
        <MakeSelection />
      </div>
    </div>
  </div>
)

const MakeSelection = () => (
  <div className='l-faux-table w100' style={{borderBottomStyle: 'ridge', padding: '6px', border: '1px solid #dedede', backgroundColor:'#fff'}}>
      <div className='l-faux-row fz-14' style={{borderBottom: '1px solid #dedede'}}>
          <div className='l-faux-cell' style={{textAlign: 'left', padding: '6px', borderBottom: '1px solid #dedede'}}>
              Pick One
          </div>
          <div className='l-faux-cell' style={{textAlign: 'center', padding: '6px', borderBottom: '1px solid #dedede'}}>
              <input type='checkbox'></input>Fixed Price
          </div>
          <div className='l-faux-cell' style={{textAlign: 'right', padding: '6px', borderBottom: '1px solid #dedede'}}>
              <PriceSelection />
              <button style={{border: 0, backgroundColor: '#689f38', height: '36px', outline: '1px solid #dedede'}}>Add</button>
          </div>
      </div>

      {/*<div className='l-faux-row fz-14'>
          <div className='l-faux-cell' style={{textAlign: 'left', padding: '6px'}}>
              <AcceptorSelection />
          </div>
          <div className='l-faux-cell' style={{textAlign: 'right', padding: '6px'}}>
              <PriceSelection />
              <button style={{border: 0, backgroundColor: '#689f38', height: '36px', outline: '1px solid #dedede'}}>Add</button>
          </div>
      </div>*/}

  </div>
)


const PriceSelection = () => {
  const data = [5, 10, 15, 20, 25, 30, 40, 50]

  return <select style={{height: '38px', lineHeight: '38px', backgroundColor: '#fdfdfd', borderColor: '#dedede'}}>
    {
      data.map(key => {
        const item = data[key]
        return <option key={key} value={item}>${item}</option>
      })
    }
  </select>
}

function FastRunnersList({runners}: {runners: IFastRunners}) {
  return <div>
    {
      Object.keys(runners.Items).map((key, index) => {
        const item = runners.Items[parseInt(key)] as IFastRunner
        return <FastRunner acceptor={item} key={key} />
      })
    }
  </div>
}

const FastRunner = ({acceptor}: {acceptor: IFastRunner}) => (
  <div className={classNames(style.cardcontainer)}>
    <div className={classNames(style.cardGoodThingsRow)}>>
      <div className={classNames('l-faux-table fz-12 w100')}>
        <div className='l-faux-row'>

          <div className='l-faux-cell l-cell-xs-1 text-center aligntop'>
            <div className={classNames('l-faux-table')}>
              <div className='l-faux-row'>
                <div className='l-faux-cell'>{acceptor.acceptorNumber}</div>
              </div>
              <div className='l-faux-row'>
                <div className={classNames('l-faux-cell', style.silk)} style={{ background: acceptor.silkImage.cssurl, width: acceptor.silkImage.width }} />
              </div>
            </div>
          </div>

          <div className='l-faux-cell l-cell-xs-7 text-left aligntop'>
            <div className='l-faux-table w100'>
              <div className='l-faux-row'>
                <div className='l-faux-cell' style={{fontWeight: 'bold'}}>
                  {acceptor.acceptorName} <HorseBarrierImage barrier={acceptor.barrier} />
                    {/*<div className={classNames('', style.barrierImage)}/>*/}

                </div>
                <div className='l-faux-cell' style={{textAlign: 'right', verticalAlign: 'middle'}}>
                  {getStarImage(acceptor.acceptorNumber)}
                </div>

              </div>
              <div className='l-faux-row'>
                <div className='l-faux-cell'>
                  {acceptor.jockey} {getGenderImage(acceptor.jockeyGender)}
                </div>
              </div>
            </div>
          </div>

          <div className='l-faux-cell l-cell-xs-2 text-right aligntop'>
            <span style={{textAlign: 'right', whiteSpace: 'nowrap', color: '#2b7d84', padding: '16px'}}>{acceptor.fixedOdds}</span>
            <span style={{textAlign: 'right', whiteSpace: 'nowrap', color: '#380982', padding: '14px'}}>{acceptor.toteOdds}</span>
          </div>

        </div>
      </div>
    </div>
  </div>
)


// private functions

function FormatDate(date: Date, format: string): string {
  const displayDate = Moment(date)
    .local()
    .format(format)

  return displayDate
}

function FormatGiddyUpOdds(odds: number): string {
  return !!odds ? `$${odds.toFixed(2)}` : '-'
}


// functions to help develop this code that can be deleted when we wire up reall API calls

function CreateDummyItem(acceptorNumber: number, acceptorName: string, barrier: number, fixedOdds: number, toteOdds: number, jockey: string, jockeyGender: JockeyGenderType): IFastRunner {
  const silkLeft = 25 - (25 * acceptorNumber)

  const item: IFastRunner = {
        silkIndex: acceptorNumber,
        barrier,
        acceptorName,
        acceptorNumber,
        fixedOdds,
        toteOdds,
        jockey,
        jockeyGender,
        isScratched: false,
        //silkImage: { cssurl: `url("https://ttabtouch.rwwaq.com.au/Image/GetSilkSprite?Area=Tote&meetingId=AR&raceNo=1&meetingDate=02%2F16%2F2017%2000%3A00%3A00&isTrots=False&ScreenSize=375") no-repeat ${silkLeft}px 0px`,
            silkImage: { cssurl: `url("https://www.tabtouch.mobi/Image/GetSilkSprite?Area=Tote&meetingId=MR&raceNo=2&meetingDate=02%2F16%2F2017%2000%3A00%3A00&isTrots=False&ScreenSize=375") no-repeat ${silkLeft}px 0px`,
            url: '',
            width: 25 },
    }

  return item
}

function CreateDummyList(): IFastRunners {
  const retValue: IFastRunners = {
    Items: {
      1: CreateDummyItem(1, 'BIG ORANGE', 7, 1, 2, 'Jamie Spencer', JockeyGenderType.Male),
      2: CreateDummyItem(2, 'OUR IVANHOWE', 6, 1, 2, 'Dwayne Dunn', JockeyGenderType.Male),
      3: CreateDummyItem(3, 'CURREN MIROTIC', 18, 1, 2, 'Tommy Berry', JockeyGenderType.Male),
      4: CreateDummyItem(4, 'BONDI BEACH', 5, 1, 2, 'Ryan Moore', JockeyGenderType.Male),
      5: CreateDummyItem(5, 'EXOSPHERIC', 13, 1, 2, 'Damien Oliver', JockeyGenderType.Male),
      6: CreateDummyItem(6, 'HARTNELL', 12, 1, 2, 'James McDonald', JockeyGenderType.Male),
      7: CreateDummyItem(7, 'WHO SHOT THEBARMAN', 20, 1, 2, 'Hugh Bowman', JockeyGenderType.Male),
      8: CreateDummyItem(8, 'WICKLOW BRAVE', 24, 1, 2, 'Frankie Dettori', JockeyGenderType.Male),
      9: CreateDummyItem(9, 'ALMOONQITH', 19, 1, 2, 'Michael Walker', JockeyGenderType.Male),
      10: CreateDummyItem(10, 'GALLANTE', 2, 1, 2, 'Blake Shinn', JockeyGenderType.Male),
      11: CreateDummyItem(11, 'GRAND MARSHAL', 9, 1, 2, 'Ben Melham', JockeyGenderType.Male),
      12: CreateDummyItem(12, 'JAMEKA', 3, 1, 2, 'Nicholas Hall', JockeyGenderType.Male),
      13: CreateDummyItem(13, 'HEARTBREAK CITY', 23, 1, 2, 'Joao Moreira', JockeyGenderType.Male),
      14: CreateDummyItem(14, 'SIR JOHN HAWKWOOD', 14, 1, 2, 'Blake Spriggs', JockeyGenderType.Male),
      15: CreateDummyItem(15, 'EXCESS KNOWLEDGE', 21, 1, 2, 'Vlad Duric', JockeyGenderType.Male),
      16: CreateDummyItem(16, 'BEAUTIFUL ROMANCE', 1, 1, 2, 'Damian Lane', JockeyGenderType.Male),
      17: CreateDummyItem(17, 'ALMANDIN', 17, 1, 2, 'Kerrin McEvoy', JockeyGenderType.Male),
      18: CreateDummyItem(18, 'ASSIGN', 22, 1, 2, 'Katelyn Mallyon', JockeyGenderType.Female),
      19: CreateDummyItem(19, 'GREY LION', 16, 1, 2, 'Glen Boss', JockeyGenderType.Male),
      20: CreateDummyItem(20, 'OCEANOGRAPHER', 11, 1, 2, 'Chad Schofield', JockeyGenderType.Male),
      21: CreateDummyItem(21, 'SECRET NUMBER', 10, 1, 2, 'Stephen Baster', JockeyGenderType.Male),
      22: CreateDummyItem(22, 'PENTATHLON', 4, 1, 2, 'Mark Du Plessis', JockeyGenderType.Male),
      23: CreateDummyItem(23, 'QEWY', 15, 1, 2, 'Craig Williams', JockeyGenderType.Male),
      24: CreateDummyItem(24, 'ROSE OF VIRGINIA', 8, 1, 2, 'Ben E Thompson', JockeyGenderType.Male),
    }
  }

  return retValue
}

function CreateDummyHeader(): IHeader {
  const item: IHeader = {
        raceCourse: 'Melbourne Cup 2017 - Flemington',
        raceNumber: 7,
        distance: 3200,
        raceTime: new Date(2017, 11, 7, 15, 0, 0, 0),
    }

  return item
}

function getGenderImage(gender: JockeyGenderType) {
  switch (gender) {
      case JockeyGenderType.Female: return <GenderFemaleImage />
      case JockeyGenderType.Male: return <GenderMaleImage />
      default: return null
  }
}

const GenderFemaleImage = () => {
  const imagePath = require('./paths/gender-female.path')

  return <svg version='1.0' width='18px' height='18px' viewBox='0 0 110.000000 160.000000' preserveAspectRatio='xMidYMid meet'>
      <g transform='translate(0, 0) scale(1,1)' fill='#ED008C' stroke='none'>
          <path d={imagePath} />
      </g>
  </svg>
}

const GenderMaleImage = () => {
  const imagePath = require('./paths/gender-male.path')

  return <svg width='18px' height='18px' viewBox='0 0 117.000000 172.000000' preserveAspectRatio='xMidYMid meet'>
      <g transform='translate(0, 0) scale(1, 1)' fill='#4169E1' stroke='none'>
          <path d={imagePath} />
      </g>
  </svg>
}

function getStarImage(acceptionNumber: number) {
  return (acceptionNumber === 3) ? <StarImage /> : null
}

const StarImage = () => (
  <svg width='18px' height='18px' viewBox='0 0 120 120' preserveAspectRatio='xMidYMid meet'>
    <polygon fill='#FF9600' points='50.5,5.027 65.259,34.93 98.259,39.725 74.379,63.001 80.016,95.868 50.5,80.351 20.984,95.868 26.621,63.001 2.742,39.725 35.742,34.93 '/>
  </svg>
)

const HorseBarrierImage = ({barrier}: {barrier: number}) => {
  return <svg style={{display: 'inline-block'}} width='20px' height='20px' viewBox='0 0 20 20'>
      <circle cx='10' cy='10' r='10' color='#542d6b' />
      <text x='10' y='12' textAnchor='middle' fontSize='12px' fill='#fff' dy='.2em'>{barrier}</text>
  </svg>
}

function getRaceCountDownComponent(raceTime: Date) {

  console.log(raceTime);
  let raceCountDown = <div />

  if (raceTime !== null) {
    raceCountDown = <RaceCountDown raceTime={raceTime}/>
  }

  return raceCountDown
}

// const RaceCountDown = observe<number, Date>(Rx.Observable.interval(1000).startWith(0), (raceTime) => {
const RaceCountDown = observe<number, {raceTime:Date}>(Rx.Observable.interval(1000).startWith(0), ({raceTime}) => {
  const timeToRace = Moment.duration(Moment(raceTime).diff(getCurrentTime()))

  return <div>
    <span className={classNames('ml1em', style.raceTimer, getDurationColour(timeToRace) )} data-tid-countdown-colour />
    <span className={classNames('fz-14 faux-strong', style.raceTimerText)} data-tid-coutdown-time>{getDurationText(timeToRace)}</span>
  </div>
})

function getDurationColour(timeToRace: Moment.Duration) {
  if (timeToRace.asMinutes() < 3) {
    return style.redBG
  }

  if (timeToRace.asMinutes() < 10) {
    return style.orangeBG
  }

  return style.greenBG
}

function getDurationText(timeToRace: Moment.Duration) {
  const prefix = (timeToRace.asMilliseconds() < 0) ? '-' : ''
  const duration = timeToRace.abs()

  const days = (duration.days() > 0) ? duration.days() + 'd' : ''
  const hours = (duration.hours() > 0) ? duration.hours() + 'h' : ''
  const minutes = (duration.minutes() > 0) ? duration.minutes() + 'm' : ''
  const seconds = (duration.seconds() > 0) ? duration.seconds() + 's' : ''

  if (duration.days() > 0) {
    return prefix + `${days} ${hours}`.trim()
  }

  if (duration.hours() >= 1) {
    return prefix + `${hours} ${minutes}`.trim()
  }

  if (duration.minutes() >= 10) {
    return prefix + `${minutes}`.trim()
  }

  if (duration.minutes() > 0 || duration.seconds() > 0) {
    return prefix + `${minutes} ${seconds}`.trim()
  }

  return '0s'
}
