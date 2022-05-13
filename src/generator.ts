'use strict';
import config from "config";
const epoch = config.get("epoch") as number;

type Snowflake = bigint | number;

interface WorkerOptions {
	epoch?: Snowflake;
	workerIdBits?: Snowflake;
	datacenterIdBits?: Snowflake;
	sequence?: Snowflake;
	sequenceBits?: Snowflake;
}

export class SequenceGenerator {
	epoch: bigint;
	workerId: bigint;
	workerIdBits: bigint;
	maxWorkerId: bigint;
	datacenterId: bigint;
	datacenterIdBits: bigint;
	maxDatacenterId: bigint;
	sequence: bigint;
	sequenceBits: bigint;
	workerIdShift: bigint;
	datacenterIdShift: bigint;
	timestampLeftShift: bigint;
	sequenceMask: bigint;
	lastTimestamp: bigint = -1n;

	constructor(workerId: Snowflake = 0n, datacenterId: Snowflake = 0n, options?: WorkerOptions) {
		// Epoch
		this.epoch = BigInt(options?.epoch ?? epoch);

		// Worker
		this.workerId = BigInt(workerId);
		this.workerIdBits = BigInt(options?.workerIdBits ?? 5);
		this.maxWorkerId = -1n ^ (-1n << this.workerIdBits);
		if (this.workerId < 0 || this.workerId > this.maxWorkerId) {
			throw new Error(
				'With ' +
					this.workerIdBits.toString() +
					" bits, worker id can't be greater than " +
					this.maxWorkerId.toString() +
					' or less than 0',
			);
		}

		// Datacenter
		this.datacenterId = BigInt(datacenterId);
		this.datacenterIdBits = BigInt(options?.datacenterIdBits ?? 5);
		this.maxDatacenterId = -1n ^ (-1n << this.datacenterIdBits);
		if (this.datacenterId > this.maxDatacenterId || this.datacenterId < 0) {
			throw new Error(
				'With ' +
					this.datacenterIdBits.toString() +
					" bits, datacenter id can't be greater than " +
					this.maxDatacenterId.toString() +
					' or less than 0',
			);
		}

		// Sequence
		this.sequence = BigInt(options?.sequence ?? 0);
		this.sequenceBits = BigInt(options?.sequenceBits ?? 12);
		this.sequenceMask = -1n ^ (-1n << this.sequenceBits);

		// Shift
		this.workerIdShift = this.sequenceBits;
		this.datacenterIdShift = this.sequenceBits + this.workerIdBits;
		this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
	}

	get workersId(): bigint {
		return this.workerId;
	}

	get datacentersId(): bigint {
		return this.datacenterId;
	}

	get currentSequence(): bigint {
		return this.sequence;
	}

	get lastTimestamps(): bigint {
		return this.lastTimestamp;
	}

	nextId(): bigint {
		let timestamp = SequenceGenerator.now();

		if (timestamp < this.lastTimestamp) {
			throw new Error(
				"Clock moved backwards. Can't generate new ID for " +
					(this.lastTimestamp - timestamp).toString() +
					'milliseconds.',
			);
		}

		if (timestamp === this.lastTimestamp) {
			this.sequence = (this.sequence + 1n) & this.sequenceMask;
			if (this.sequence === 0n) {
				timestamp = this.tilNextMillis(this.lastTimestamp);
			}
		} else {
			this.sequence = 0n;
		}

		this.lastTimestamp = timestamp;

		return (
			((timestamp - this.epoch) << this.timestampLeftShift) |
			(this.datacenterId << this.datacenterIdShift) |
			(this.workerId << this.workerIdShift) |
			this.sequence
		);
	}

	tilNextMillis(lastTimestamp: bigint): bigint {
		let timestamp;

		do {
			timestamp = SequenceGenerator.now();
		} while (timestamp <= lastTimestamp);

		return timestamp;
	}

	static now(): bigint {
		return BigInt(Date.now());
	}
}