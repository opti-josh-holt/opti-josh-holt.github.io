import React, { useState, useEffect } from 'react';
// Javascript sdk
import { createInstance } from '@optimizely/optimizely-sdk';
// React sdk
import {
  //createInstance,
  OptimizelyProvider,
  useDecision,
} from '@optimizely/react-sdk';
// mui
import { Typography, Box } from '@mui/material';
// charts
import { PieChart } from 'recharts';
// Table component
import DecisionTable from './DecisionTable';

const DecisionResults = ({ inputSettings }) => {
  const { sdkKey, flagKey, numUsers, sdkMethod, eventKey, numRuns } =
    inputSettings;
  const [allDecisions, setAllDecisions] = useState([]);

  useEffect(() => {
    makeDecisions(flagKey, eventKey).then((decisions) => {
      if (decisions != allDecisions) {
        setAllDecisions(decisions);
      }
    });
  }, [numRuns]);

  // Use SDK method from input form
  // useEffect(() => {
  //   if (sdkMethod === 'decide') {
  //     mockDecisions(flagKey).then((decisions) => {
  //       if (decisions != allDecisions) {
  //         setAllDecisions(decisions);
  //       }
  //     });
  //   } else if (sdkMethod === 'activate') {
  //     mockActivate(flagKey).then((decisions) => {
  //       if (decisions != allDecisions) {
  //         setAllDecisions(decisions);
  //       }
  //     });
  //   } else if (sdkMethod === 'isFeatureEnabled') {
  //     mockIsFeatureEnabled(flagKey).then((decisions) => {
  //       if (decisions != allDecisions) {
  //         setAllDecisions(decisions);
  //       }
  //     });
  //   }
  // }, [numRuns]);

  const optimizelyClient = createInstance({
    sdkKey: sdkKey,
  });

  function Pre(props) {
    return <pre style={{ margin: 0 }}>{props.children}</pre>;
  }

  function isClientValid() {
    return optimizelyClient.getOptimizelyConfig() !== null;
  }

  // consolidated makeDecisions function that toggles betwee sdk methods
  async function makeDecisions(decisionKey, eventKey) {
    let decisionArray = [];
    await optimizelyClient.onReady();

    if (!optimizelyClient.isValidInstance()) {
      console.log('Invalid Opti Instance');
    }

    if (isClientValid()) {
      for (let i = 0; i < numUsers; i++) {
        // TODO - implement user attributes

        // Randomly assign user a country attribute of US or CO
        //let rand = Math.round(Math.random());
        //let userCountryCode = rand === 0 ? 'US' : 'CO';
        // let attributes = {
        //   country: userCountryCode,
        //   randomNumber: Math.round(Math.random()),
        // };

        // make a random user ID
        const userId = Math.floor(
          Math.random() * (100000 - 10000) + 10000
        ).toString();

        if (sdkMethod === 'decide') {
          let user = optimizelyClient.createUserContext(userId);
          let decision = user.decide(decisionKey);

          // Send event
          if (eventKey) {
            // TODO - implement event tags
            user.trackEvent(eventKey);
          }

          decisionArray.push({
            userId: userId,
            flagOrFeatureKey: decision.flagKey,
            ruleKey: decision.ruleKey,
            variation: decision.variationKey,
            enabled: decision.enabled,
          });
        } else if (sdkMethod === 'activate') {
          let activation = optimizelyClient.activate(decisionKey, userId);

          // Send event
          if (eventKey) {
            // TODO - implement event tags
            optimizelyClient.track(eventKey, userId);
          }

          decisionArray.push({
            userId: userId,
            ruleOrExperimentKey: decisionKey,
            variationKey: activation,
          });
        } else if (sdkMethod === 'isFeatureEnabled') {
          let isFeatureEnabled = optimizelyClient.isFeatureEnabled(
            decisionKey,
            userId
          );

          // Send event
          if (eventKey) {
            optimizelyClient.track(eventKey, userId);
          }
          decisionArray.push({
            userId: userId,
            flagOrFeatureKey: decisionKey,
            flagState: isFeatureEnabled,
          });
        }
      }
      return decisionArray;
    }
  }

  // RENDER RESULTS
  console.log(eventKey);

  if (allDecisions.length > 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant='h4'>Decision Results</Typography>
        <DecisionTable decisionResults={allDecisions} />
      </Box>
    );
  } else return null;
};

export default DecisionResults;
