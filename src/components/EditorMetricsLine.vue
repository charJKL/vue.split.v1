<template>
	<line :x1="x1" :y1="y1" :x2="x2" :y2="y2" stroke="black" />
	<text :x="x1" :y="y1" class="small">{{ name }}</text>
</template>

<script>
export default
{
	props: 
	{
		value: { type: Number, requred: true },
		type: { type: String, requred: true },
		name: { type: String },
	},
	computed:
	{
		x1()
		{
			if(this.type === 'horizontal') return 0;
			if(this.type === 'vertical') return this.value;
			throw new Error('Line type is wrong');
		},
		x2()
		{
			if(this.type === 'horizontal') return '100%';
			if(this.type === 'vertical') return this.value;
			throw new Error('Line type is wrong');
		},
		y1()
		{
			if(this.type === 'horizontal') return this.value;
			if(this.type === 'vertical') return 0;
			throw new Error('Line type is wrong');
		},
		y2()
		{
			if(this.type === 'horizontal') return this.value;
			if(this.type === 'vertical') return '100%';
			throw new Error('Line type is wrong');
		}
	},
	methods:
	{
		
	}
}
</script>

<style>

</style>