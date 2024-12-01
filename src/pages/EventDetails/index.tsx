import {
    DataLocationOnChain,
    decodeOnChainData,
    EvmChains,
    IndexService,
    SignProtocolClient,
    SpMode,
} from '@ethsign/sp-sdk';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { privateKeyToAccount } from 'viem/accounts';
import VerticalLinearStepper from '../../components/stepper';
import { Button } from '../../components/ui/button';
import StarWarsButton from '../../components/ui/startwar-btn';
import {
    calculateDistance,
    extractCoordinates,
    getUserLocation,
} from '../../lib/helper';
import { events } from '../Events';
const privateKey =
    '0xe1d4b11589a54870b3df94b0c20bb6dd8b3e1611123b1223f7901041e126b612';
const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.polygonAmoy,
    account: privateKeyToAccount(privateKey),
});

const getEventDetails = (id: string) => {
    return events.find((event) => event.slug === id);
};

export default function EventPage() {
    const [isUserInRange, setIsUserInRange] = useState(false);
    const params = useParams();
    const eventId = params.eventId as string;
    const event = getEventDetails(eventId);
    if (!event) {
        return <div>Event not found</div>;
    }

    const validateUserCoordinates = async () => {
        toast.loading('Verifying user location...');
        const location = await getUserLocation();
        const indexService = new IndexService('testnet');
        const res = await indexService.queryAttestation(
            'onchain_evm_80002_0x15a'
        );
        const attestationData = res?.data;

        const schemaData = `[{"name":"contractDetails","type":"string"},{"name" : "event_location", "type" : "string[]"},{"name" : "record_timestamp", "type" : "string"}]`;
        const encodedDataHere = decodeOnChainData(
            attestationData,
            DataLocationOnChain.ONCHAIN,
            JSON.parse(schemaData)
        );
        const input =
            encodedDataHere.event_location[0] +
            ' ' +
            encodedDataHere.event_location[1];

        const result = extractCoordinates(input);
        if (result) {
            const distance = calculateDistance({
                lat1: result.latitude,
                lon1: result.longitude,
                lat2: location.latitude,
                lon2: location.longitude,
            });
            if (distance <= 500) {
                toast.success('You are in range of the event location');
                setIsUserInRange(true);
            } else {
                toast.error('You are not in range of the event location');
                setIsUserInRange(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <Link to={'/events'}>
                    <Button variant="ghost" className="mb-4">
                        ← Back to Events
                    </Button>
                </Link>
                <div className="md:w-44 md:h-44 w-full h-full">
                    <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
                <h1 className="text-3xl font-semibold mb-4">{event.title}</h1>
                <div className="bg-zinc-900 rounded-lg p-6 mb-6">
                    <p className="text-lg mb-2">
                        <span className="font-medium">Date:</span> {event.date}
                    </p>
                    <p className="text-lg mb-2">
                        <span className="font-medium">Time:</span> {event.time}
                    </p>
                    {event.location && (
                        <p className="text-lg mb-2">
                            <span className="font-medium">Location:</span>{' '}
                            {event.location}
                        </p>
                    )}
                    {event.platform && (
                        <p className="text-lg mb-2">
                            <span className="font-medium">Platform:</span>{' '}
                            {event.platform}
                        </p>
                    )}
                    {event.description && (
                        <p className="text-lg mb-2">
                            <span className="font-medium">
                                About the event:
                            </span>{' '}
                            {event.description}
                        </p>
                    )}
                </div>

                <StarWarsButton
                    title={' Verify for Event'}
                    onClick={validateUserCoordinates}
                />

                <VerticalLinearStepper isUserInRange={isUserInRange} />
            </div>
        </div>
    );
}
