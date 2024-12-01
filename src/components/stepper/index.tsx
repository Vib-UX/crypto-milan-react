import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Ar from '../Ar';
import { EvmChains, SignProtocolClient, SpMode } from '@ethsign/sp-sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { getUserLocation } from '../../lib/helper';
import toast from 'react-hot-toast';
const privateKey =
    '0xe1d4b11589a54870b3df94b0c20bb6dd8b3e1611123b1223f7901041e126b612';
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey),
});
const steps = [
    {
        label: 'Select campaign settings',
        description: `You need to be within 500m of the event location to be able to verify`,
    },
    {
        label: 'Create an ad group',
        description: 'NFT collected successfully from booth',
    },
    {
        label: 'Create an ad',
        description: `Attestating user details`,
    },
    {
        label: 'Create an helo',
        description: `All set!`,
    },
];

export default function VerticalLinearStepper({
    isUserInRange,
}: {
    isUserInRange: boolean;
}) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [showAR, setShowAR] = React.useState(false);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const handleARInvokation = () => {
        setShowAR(true);
    };
    const handleCloseAR = () => {
        setShowAR(false);
        handleNext();
    };

    const handleOnSign = async () => {
        toast.loading('Pushing coordinates onchain...');
        const location = await getUserLocation();
        const createSchemaRes = await client.createSchema({
            name: 'cryptoMilan',
            data: [
                { name: 'event_name', type: 'string' },
                { name: 'event_location', type: 'string[]' },
                { name: 'record_timestamp', type: 'string' },
            ],
        });
        const schId = createSchemaRes.schemaId;
        const attestationDataSchema = {
            schemaId: schId,
            data: {
                event_name: 'coinDCX_unfold_2024',
                event_location: [
                    `Latitude: ${location.latitude}`,
                    `Longitude: ${location.longitude}`,
                ],
                record_timestamp: new Date().toISOString(),
            },
            indexingValue: 'event_coinDCX_unfold_2024',
        };
        const createAttestationRes = await client.createAttestation(
            attestationDataSchema
        );
        console.log('Attestation created:', createAttestationRes);
        toast.success('Coordinates pushed successfully');
        handleNext();
    };
    React.useEffect(() => {
        if (isUserInRange && activeStep === 0) {
            handleNext();
        }
        if (activeStep === 1) {
            handleARInvokation();
        }
        if (activeStep === 2) {
            handleOnSign();
        }
    }, [isUserInRange, activeStep]);
    return (
        <>
            {showAR && <Ar onClose={handleCloseAR} />}
            <Box sx={{ maxWidth: 400 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step
                            key={step.label}
                            completed={isUserInRange && index === 0}
                        >
                            <StepLabel
                                optional={
                                    index === steps.length - 1 ? (
                                        <Typography variant="caption">
                                            Last step
                                        </Typography>
                                    ) : null
                                }
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                <Typography>{step.description}</Typography>
                                <Box sx={{ mb: 2 }}>
                                    {/* {index !== steps.length - 1 && (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1
                                            ? 'Finish'
                                            : 'Continue'}
                                    </Button>
                                )} */}
                                    <Button
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Typography>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                            Reset
                        </Button>
                    </Paper>
                )}
            </Box>
        </>
    );
}
