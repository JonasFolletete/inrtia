# ☄️ inrtia.js 

lightweight (2ko) inertia based animation library

## Demo 
<https://jonasfolletete.github.io/inrtia/>

## Usage
```javascript
import Inrtia from 'inrtia';

var inrtia = new Inrtia({
	value : 0,
	interpolation : 'linear'
});

inrtia.to(20);
raf();

function raf() {
	if (!inrtia.stopped) {
		const value = inrtia.update(); 
		// ... Do stuff with inrtia.value
	}
	window.requestAnimationFrame(raf);
}

```


### Constructor Options
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Type</th>
			<th scope="col">Default</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left"><code>value</code> (required)</th>
			<td><code>Number</code></td>
			<td></td>
			<td>Default value</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>interpolation</code></th>
			<td><code>linear|bounce|elastic</code></td>
			<td>linear</td>
			<td>Method used for interpolation</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>friction</code></th>
			<td><code>Number</code></td>
			<td><code>10</code></td>
			<td>Rate at which values slow down after you let go.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>rigidity</code></th>
			<td><code>Number</code></td>
			<td><code>0.1</code></td>
			<td>Rate at which values slow down after you let go. (only available for <code>bounce</code> and <code>elastic</code>)</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>precisionStop</code></th>
			<td><code>Number</code></td>
			<td><code>0.001</code></td>
			<td>Minimum delta <code>(value - targetValue)</code> to stop animation</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>perfectStop</code></th>
			<td><code>Boolean</code></td>
			<td>false</td>
			<td>Define if <code>value</code> jumps to <code>targetValue</code> at the end of the animation</td>
		</tr>
	</tbody>
</table>


### Methods ###
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left"><code>.to(targetValue : &lt;number&gt;)</code></th>
			<td>Update targetValue value and restart inrtia (if stopped)</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.update()</code></th>
			<td>Method to update inrtia (to use in <code>requestAnimationFrame</code>)</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.stop()</code></th>
			<td>Stop inrtia</td>
		</tr>
	</tbody>
</table>

### Properties
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Type</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left"><code>.value</code></th>
			<td><code>Number</code></td>
			<td>Current value</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.targetValue</code></th>
			<td><code>Number</code></td>
			<td>Target value</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.stopped</code></th>
			<td><code>Boolean</code></td>
			<td>Define if inrtia is stopped </td>
		</tr>
	</tbody>
</table>

