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
import { Typography } from '@mui/material';
// charts
import { PieChart } from 'recharts';

const NewDecisionResults = ({ inputSettings }) => {
  const { sdkKey, flagKey, numUsers, sdkMethod, numRuns } = inputSettings;
  const [allDecisions, setAllDecisions] = useState([]);

  // Use SDK method from input form
  useEffect(() => {
    if (sdkMethod === 'decide') {
      mockDecisions(flagKey).then((decisions) => {
        if (decisions != allDecisions) {
          setAllDecisions(decisions);
        }
      });
    } else if (sdkMethod === 'activate') {
      mockActivate(flagKey).then((decisions) => {
        if (decisions != allDecisions) {
          setAllDecisions(decisions);
        }
      });
    } else if (sdkMethod === 'isFeatureEnabled') {
      mockIsFeatureEnabled(flagKey).then((decisions) => {
        if (decisions != allDecisions) {
          setAllDecisions(decisions);
        }
      });
    }
  }, [numRuns]);

  const optimizelyClient = createInstance({
    sdkKey: sdkKey,
  });

  function Pre(props) {
    return <pre style={{ margin: 0 }}>{props.children}</pre>;
  }

  function isClientValid() {
    return optimizelyClient.getOptimizelyConfig() !== null;
  }

  // DECIDE API

  async function mockDecisions(flagKey) {
    let decisionArray = [];
    await optimizelyClient.onReady();

    if (!optimizelyClient.isValidInstance()) {
      console.log('Invalid Opti Instance');
    }

    if (isClientValid()) {
      for (let i = 0; i < numUsers; i++) {
        // Randomly assign user a country attribute of US or CO
        let rand = Math.round(Math.random());
        let userCountryCode = rand === 0 ? 'US' : 'CO';
        let attributes = {
          country: userCountryCode,
          randomNumber: Math.round(Math.random()),
        };

        // make a random user ID
        const userId = Math.floor(
          Math.random() * (100000 - 10000) + 10000
        ).toString();

        let user = optimizelyClient.createUserContext(userId, attributes);
        let decision = user.decide(flagKey);
        console.log(decision);
        decisionArray.push({
          userId: userId,
          flagOrFeatureKey: decision.flagKey,
          ruleKey: decision.ruleKey,
          variation: decision.variationKey,
          enabled: decision.enabled,
        });
      }
      return decisionArray;
    }
  }

  // ACTIVATE

  async function mockActivate(experimentKey) {
    let decisionArray = [];
    await optimizelyClient.onReady();

    if (!optimizelyClient.isValidInstance()) {
      console.log('Invalid Opti Instance');
    }

    if (isClientValid()) {
      for (let i = 0; i < numUsers; i++) {
        // Randomly assign user a country attribute of US or CO
        let rand = Math.round(Math.random());
        let userCountryCode = rand === 0 ? 'US' : 'CO';
        let attributes = {
          country: userCountryCode,
          randomNumber: Math.round(Math.random()),
        };

        // make a random user ID
        const userId = Math.floor(
          Math.random() * (100000 - 10000) + 10000
        ).toString();

        let activation = optimizelyClient.activate(
          experimentKey,
          userId,
          attributes
        );

        decisionArray.push({
          userId: userId,
          ruleOrExperimentKey: experimentKey,
          variationKey: activation,
        });
      }
      return decisionArray;
    }
  }

  // IS FEATURE ENABLED

  async function mockIsFeatureEnabled(featureKey) {
    let decisionArray = [];
    await optimizelyClient.onReady();

    if (!optimizelyClient.isValidInstance()) {
      console.log('Invalid Opti Instance');
    }

    if (isClientValid()) {
      for (let i = 0; i < numUsers; i++) {
        // Randomly assign user a country attribute of US or CO
        let rand = Math.round(Math.random());
        let userCountryCode = rand === 0 ? 'US' : 'CO';
        let attributes = {
          country: userCountryCode,
          randomNumber: Math.round(Math.random()),
        };

        // make a random user ID
        const userId = Math.floor(
          Math.random() * (100000 - 10000) + 10000
        ).toString();

        //let user = optimizelyClient.createUserContext(userId, attributes);
        let isFeatureEnabled = optimizelyClient.isFeatureEnabled(
          featureKey,
          userId,
          attributes
        );
        console.log(isFeatureEnabled);
        decisionArray.push({
          userId: userId,
          flagOrFeatureKey: featureKey,
          flagState: isFeatureEnabled,
        });
      }
      return decisionArray;
    }
  }

  // RENDER RESULTS

  if (allDecisions.length > 0) {
    return (
      <Typography variant='body1'>{JSON.stringify(allDecisions)}</Typography>
    );
  } else return <Typography>empty</Typography>;

  function FlagsOffMessage({ projectId }) {
    const navLink = `https://app.optimizely.com/v2/projects/${projectId}/settings/implementation`;
    return (
      <div>
        <Pre>Flag was off for everyone. Some reasons could include:</Pre>
        <Pre>
          1. Your sample size of visitors was too small. Rerun, or increase the
          iterations in the FOR loop
        </Pre>
        <Pre>
          2. By default you have 2 keys for 2 project environments (dev/prod).
          Verify in Settings then Environments that you used the right key for
          the environment where your flag is toggled to ON.
        </Pre>
        <Pre>
          Check your key at <a href={navLink}>{navLink}</a>
        </Pre>
        <br />
      </div>
    );
  }
};

export default NewDecisionResults;
