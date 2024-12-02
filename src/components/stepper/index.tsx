import { EvmChains, SignProtocolClient, SpMode } from '@ethsign/sp-sdk';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { OktoContextType, useOkto } from 'okto-sdk-react';
import * as React from 'react';
import toast from 'react-hot-toast';
import { privateKeyToAccount } from 'viem/accounts';
import { getUserLocation } from '../../lib/helper';
import Ar from '../Ar';
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
    event,
    isUserInRange,
}: {
    event: any;
    isUserInRange: boolean;
}) {
    const { executeRawTransaction } = useOkto() as OktoContextType;
    const [activeStep, setActiveStep] = React.useState(0);
    const [showAR, setShowAR] = React.useState(false);
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleRedeem = async () => {
        toast.loading('Redeeming perks...');
        const location = await getUserLocation();
        if (!localStorage.getItem('userUsed')) {
            await executeRawTransaction({
                network_name: 'APTOS_TESTNET',
                transaction: {
                    transactions: [
                        {
                            function:
                                '0x1f14c842666214863d1dce2d3c82ea9db512b35b98718d00a40e60633bfdf5e5::nft_milan::initialize_collection',
                            typeArguments: [],
                            functionArguments: [],
                        },
                    ],
                },
            });
            localStorage.setItem('userUsed', 'true');
        }

        await executeRawTransaction({
            network_name: 'APTOS_TESTNET',
            transaction: {
                transactions: [
                    {
                        function:
                            '0x1f14c842666214863d1dce2d3c82ea9db512b35b98718d00a40e60633bfdf5e5::nft_milan::mint_nft',
                        typeArguments: [],
                        functionArguments: [
                            event.title,
                            event.description,
                            location.latitude,
                            location.longitude,
                            event.hosts[0].name,
                            'https://violet-gentle-cow-510.mypinata.cloud/ipfs/QmdFHqPUoLR3BvZDkjwne9dFYXThFYK221yHfaAYc8Zeix',
                        ],
                    },
                ],
            },
        }).then(async (result: any) => {
            toast.success(`${result.orderId} orderId`);
            toast.success('Perks redeemed successfully');
        });
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
                                {activeStep === 2 && (
                                    <Box sx={{ mb: 2 }}>
                                        <Button
                                            onClick={handleRedeem}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Redeem
                                        </Button>
                                    </Box>
                                )}
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
