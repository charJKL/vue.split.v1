import Status from '../../../lib/Status';

const ProvieStatus = 
{
	props:
	{
		status: {type: Number, required: true, validator(value){ return Object.values(Status).includes(value); }},
		details: {type: String, required: true},
	},
	computed:
	{
		printStatus()
		{
			return Status.toString(this.status);
		},
		printDetails()
		{
			return this.details;
		},
		isStatusDirty()
		{
			return this.status == Status.Dirty;
		},
		isStatusWaiting()
		{
			return this.status == Status.Waiting;
		},
		isStatusQueued()
		{
			return this.status == Status.Queued;
		},
		isStatusLoading()
		{
			return this.status == Status.Loading;
		},
		isStatusWorking()
		{
			return this.status == Status.Working;
		},
		isStatusError()
		{
			return this.status == Status.Error;
		},
		isStatusCompleted()
		{
			return this.status == Status.Completed;
		},
		isStatusNotCompleted()
		{
			return this.status < Status.Completed;
		}
	}
}

export default ProvieStatus;