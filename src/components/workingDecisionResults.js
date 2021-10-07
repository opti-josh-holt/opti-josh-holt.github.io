import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
// Javascript sdk
//import { createInstance } from '@optimizely/optimizely-sdk';
// React sdk
import {
  createInstance,
  OptimizelyProvider,
  useDecision,
} from '@optimizely/react-sdk';
// mui
import { Typography } from '@mui/material';
// charts
import { PieChart } from 'recharts';

const DecisionResults = ({ inputSettings }) => {
  const { sdkKey, flagKey, numUsers } = inputSettings;

  const optimizelyClient = createInstance({
    sdkKey: sdkKey,
  });

  function Pre(props) {
    return <pre style={{ margin: 0 }}>{props.children}</pre>;
  }

  function isClientValid() {
    return optimizelyClient.getOptimizelyConfig() !== null;
  }

  const userIds = [];
  while (userIds.length < numUsers) {
    // userIds.push((Math.floor(Math.random() * 999999) + 100000).toString())
    userIds.push(`user-${userIds.length + 1}`);
  }

  // Add decisions to array for pie chart
  // Errors currently
  const decisions = [];
  //   userIds.map((user) => {
  //     const decision = GetDecision(user);
  //     const [decision, clientReady] = useDecision(
  //       flagKey,
  //       {},
  //       { overrideUserId: userId }
  //     );
  //     decisions.push(decision);
  //   });
  console.log(decisions);

  let userMessages = userIds.reduce(
    (result, userId) => ({ ...result, [userId]: [] }),
    {}
  );
  const donePromise = new Promise((resolve) => {
    setTimeout(() => {
      optimizelyClient.onReady().then(() => {
        if (isClientValid()) {
          // userIds.forEach((userId) => {
          //   const question = `Pretend that user ${userId} made a purchase?`;
          //   const trackEvent = window.confirm(question);
          //   optimizelyClient.track('purchase', userId);
          //   const message = trackEvent
          //                     ? "Optimizely recorded a purchase in experiment results for this user"
          //                     : "Optimizely didn't record a purchase in experiment results for this user";
          //   userMessages[userId].push(`${question} ${trackEvent ? 'Y' : 'N'}`, message);
          // });
        }
        resolve();
      });
    }, 500);
  });

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
          Verify in Settings>Environments that you used the right key for the
          environment where your flag is toggled to ON.
        </Pre>
        <Pre>
          Check your key at <a href={navLink}>{navLink}</a>
        </Pre>
        <br />
      </div>
    );
  }

  function GetDecision({ userId }) {
    const [decision, clientReady] = useDecision(
      flagKey,
      {},
      { overrideUserId: userId }
    );

    // Don't render the component if SDK client is not ready yet.
    if (!clientReady) {
      return null;
    }

    if (decision.enabled) {
      setTimeout(() => setHasOnFlag(true));
    }

    return decision;
  }

  function Decision({ userId, setHasOnFlag }) {
    // Generally React SDK runs for one client at a time i.e for one user throughout the lifecycle.
    // You can provide the user Id once while wrapping the app in the Provider component and the SDK will memoize and reuse it throughout the application lifecycle.
    // For this example, we are simulating 10 different users so we will ignore this and pass override User IDs to the useDecision hook for demonstration purpose.
    // This override will not be needed for normal react sdk use cases.
    const [decision, clientReady] = useDecision(
      flagKey,
      {},
      { overrideUserId: userId }
    );

    // Don't render the component if SDK client is not ready yet.
    if (!clientReady) {
      return '';
    }

    const variationKey = decision.variationKey;
    if (variationKey === null) {
      console.log(' decision error: ', decision['reasons']);
    }

    if (decision.enabled) {
      setTimeout(() => setHasOnFlag(true));
    }

    return (
      <Typography variant='body1'>
        {`Flag ${
          decision.enabled ? 'on' : 'off'
        }. User number ${userId} saw flag variation: ${variationKey} as part of flag rule: ${
          decision.ruleKey
        }`}
      </Typography>
    );
  }

  // Instantiate an Optimizely client
  const [hasOnFlag, setHasOnFlag] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isClientReady, setIsClientReady] = useState(null);

  donePromise.then(() => setIsDone(true));
  optimizelyClient.onReady().then(() => {
    isClientValid() && setIsClientReady(true);
  });

  let projectId;

  if (isClientValid()) {
    const datafile = JSON.parse(
      optimizelyClient.getOptimizelyConfig().getDatafile()
    );
    projectId = datafile.projectId;
  }

  const reportsNavLink = `https://app.optimizely.com/v2/projects/${projectId}/reports`;

  if (inputSettings) {
    return (
      <OptimizelyProvider
        optimizely={optimizelyClient}
        // Generally React SDK runs for one client at a time i.e for one user throughout the lifecycle.
        // You can provide the user Id here once and the SDK will memoize and reuse it throughout the application lifecycle.
        // For this example, we are simulating 10 different users so we will ignore this and pass override User IDs to the useDecision hook for demonstration purpose.
        user={{ id: 'default_user' }}
      >
        {isClientReady && (
          <>
            {userIds.map((userId) => (
              <>
                <Decision
                  key={userId}
                  userId={userId}
                  setHasOnFlag={setHasOnFlag}
                />
                {userMessages[userId].map((message) => (
                  <Pre>{message}</Pre>
                ))}
                <br />
              </>
            ))}
            {!hasOnFlag && <FlagsOffMessage projectId={projectId} />}
            {isDone && (
              <>
                <Pre>Done with your mocked A/B test.</Pre>
                <Pre>
                  Check out your report at{' '}
                  <a href={reportsNavLink}>{reportsNavLink}</a>
                </Pre>
                <Pre>
                  Be sure to select the environment that corresponds to your SDK
                  key
                </Pre>
              </>
            )}
          </>
        )}
        {isDone && !isClientReady && (
          <Pre>
            Optimizely client invalid. Verify in Settings -> Environments that
            you used the primary environment's SDK key
          </Pre>
        )}
      </OptimizelyProvider>
    );
  } else {
    return <div></div>;
  }

  //return <TextField id='outlined-basic' label='Outlined' variant='outlined' />;
};

export default DecisionResults;
