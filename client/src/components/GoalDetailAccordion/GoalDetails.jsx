import React, { Fragment } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Pagination from './Pagination';
import GoalItem from '../Goals/GoalItem';
import GoalDetailData from './GoalDetailData';
import EmptyGoal from '../empty-goal-interface/EmptyGoal';
import Loader from '../loader/loader';
import Error from '../error/Error';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { getGoals } from '../../redux/showGoalSlice';
import TargetForm from '../TargetForm/TargetForm';
import { Div, Text, Button, Container } from './GoalDetail.styled';
import { openModal } from '../../redux/TargetModalSlice';
import Spinner from './GreenSpinner';
import { toggleShowOrganizationGoalTargetForm } from '../../redux/organizationGoalTarget.slice';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '420px',
    overflowY: 'scroll',
    marginTop: 0,
    zIndex: 0,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));
export default function GoalDetailAccordion() {
  let { orgId } = useParams();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const { roomId } = useSelector((state) => state.organizationRoom);
  const [goalComponents, setGoalComponents] = React.useState();
  const [pageNum, setPageNum] = React.useState(1);
  const { tab } = useSelector((state) => state.pageNum);
  const dispatch = useDispatch();
  const { goals, status, errorInfo } = useSelector((state) => state.showGoals);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  React.useEffect(() => {
    getAllComponentsFromServer(pageNum);
  }, [pageNum]);
  if (!errorInfo && !goals) return <Spinner />;
  if (status === 'loading') return <Spinner />;
  if (errorInfo) return <Error errorMessage={errorInfo.message} />;
  if (!goals.length) return <EmptyGoal />;
  async function getAllComponentsFromServer(pageNum) {
    const requestURL = `https://goals.zuri.chat/api/v1/goals/?org_id=${orgId}&page=${pageNum}&limit=3&type=${tab === 'all' ? '' : tab}`;
    dispatch(getGoals(requestURL));
  }
  return (
    <React.Fragment>
      <Container className={classes.root}>
        {/* {console.log('g',goals)} */}
        {goals &&
          goals.map((goal) => {
            return (
              <Accordion expanded={expanded == goal.room_id} onChange={handleChange(goal.room_id)} key={goal.room_id}>
                <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
                  <GoalItem goalData={goal} />
                </AccordionSummary>
                <AccordionDetails style={{ height: '50%' }}>
                  <GoalDetailData goalData={goal} />
                </AccordionDetails>
                <AccordionDetails>
                  <Div>
                    <Text primary> Goal Progress </Text>
                    <Button
                      width="143px"
                      fontSize="15px"
                      font-weight="700"
                      borderRadius="3px"
                      background="#00B87C"
                      padding="12px 35px"
                      color="#ffffff"
                      marginLeft="0px 0px"
                      onClick={() => dispatch(toggleShowOrganizationGoalTargetForm())}
                    >
                      {' '}
                      + Add Target!{' '}
                    </Button>
                  </Div>
                </AccordionDetails>
              </Accordion>
            );
          })}
        <TargetForm />
      </Container>
      {goals && <Pagination setPageNum={setPageNum} pageNum={pageNum} goalComponents={goals} />}
    </React.Fragment>
  );
}
