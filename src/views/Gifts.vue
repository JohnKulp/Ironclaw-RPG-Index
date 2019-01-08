<template>
	<div class="gifts">
		<h1>Gifts</h1>
		<v-card>
			<v-card-title>
				<v-spacer></v-spacer>
				<v-text-field
					v-model="search"
					append-icon="search"
					label="Search"
					single-line
					hide-details
				></v-text-field>
			</v-card-title>
			<v-data-table 
					:headers="headers" 
					:items="gifts" 
					:loading="loading" 
					:search="search" 
					:pagination.sync="pagination"
					rows-per-page-text=""
					:rows-per-page-items="[30]"
			>
				<v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
				<template slot="items" slot-scope="props">
					<td class="text-xs-left">{{ props.item['name'] }}</td>
					<td class="text-xs-left">{{ props.item['type'] }}</td>
					<td class="text-xs-left">{{ props.item['exhaust'] }}</td>
					<td class="text-xs-left">{{ props.item['summary'] }}</td>
					<td class="text-xs-left">{{ props.item['requirements'] }}</td>
					<td class="text-xs-left" :title="props.item['book_name']">{{ props.item['book_abbreviation'] }}</td>
					<td class="text-xs-left">{{ props.item['page'] }}</td>
					<td class="justify-center layout px-0">
						<v-icon v-if="canEdit" small class="mr-2" @click="editItem(props.item)">edit</v-icon>
					</td>

				</template>
			</v-data-table>
			<v-dialog v-if="canEdit" v-model="dialog" max-width="500px">
				<v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
				<v-card>
					<v-card-title>
						<span class="headline">{{ formTitle }}</span>
					</v-card-title>

					<v-card-text>
						<v-container grid-list-md>
							<v-layout wrap>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.name" label="Gift name"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.type" label="Gift type"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.exhaust" label="Exhaust"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.summary" label="Summary"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.gift_req_string" label="Requirements"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.book_name" label="Book"></v-text-field>
								</v-flex>
								<v-flex xs12 sm6 md4>
									<v-text-field v-model="editedItem.page" label="Page"></v-text-field>
								</v-flex>
							</v-layout>
						</v-container>
					</v-card-text>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="red darken-1" v-if="editedIndex !== -1" small @click="deleteItem">Delete</v-btn>
						<v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
						<v-btn color="blue darken-1" flat @click="save">Save</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
				{{ snackText }}
				<v-btn flat @click="snack = false">Close</v-btn>
			</v-snackbar>
		</v-card>
	</div>

</template>


<script>
// @ is an alias to /src

export default {
	name:'Gifts',
	mounted(){
		Promise.all([
			this.$store.dispatch('fetchGifts')
		]);
	},
	data () {

		return {
			snack: false,
			snackColor: '',
			snackText: '',
			dialog: false,

			search: '',
			editedIndex: -1,
			editedItem: {
				name: '',
				type: '',
				exhaust: '',
				summary: '',
				gift_req_string: '',
				book_name: '',
				page:'',
			},
			defaultItem: {
				name: '',
				type: '',
				exhaust: '',
				summary: '',
				gift_req_string: '',
				book_name: '',
				page:'',
			},
			// rowsPerPageItems: [10, 20, 30, 40, 50, {"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
			pagination:{
				descending: false,
				sortBy: 'name',
				rowsPerPage: 30
			},
		}
	},
	watch: {
		dialog (val) {
			val || this.close()
		}
	},

	// initialize (){
	// 	this.gifts = this.$store.state.gifts.gifts;
	// },

	computed: {
		formTitle () {
			return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
		},
			gifts(){
				return this.$store.state.gifts.gifts
			},
			loading() {
				return this.$store.state.gifts.isLoading
			},
			canEdit() {
				let user = this.$store.state.auth.user;
				return user && user.is_admin;
			},
			headers() {
				let user = this.$store.state.auth.user;
				let headers = [
					{
						text: 'Gift',
						align: 'left',
						value: 'name'
					},
					{ text: 'Type', value: 'type' },
					{ text: 'Exhaust', value: 'exhaust' },
					{ text: 'Summary', value: 'summary' },
					{ text: 'Requirements', value: 'gift_req_string + " " + gift_skill_req_string + " " + gift_misc_req_string' },
					{ text: 'Book', value: 'book_abbreviation' },
					{ text: 'Page', value: 'page' },
				];
				if(user && user.is_admin){
					headers.push({ text: 'Actions', value: 'name', sortable: false })
				}
				return headers;
			}
	},
	methods: {
		editItem (item) {
			this.editedIndex = this.gifts.indexOf(item);
			this.editedItem = Object.assign({}, item);
			this.dialog = true;
		},

		deleteItem (item) {
			const index = this.gifts.indexOf(item);
			confirm('Are you sure you want to delete this item?') && this.gifts.splice(index, 1);
			this.close();
		},

		close () {
			this.dialog = false
			setTimeout(() => {
				this.editedItem = Object.assign({}, this.defaultItem);
				this.editedIndex = -1;
			}, 300)
		},

		save () {
			if (this.editedIndex > -1) {
				this.$store.commit('updateGiftInList', this.editedItem);
			} else {
				this.$store.commit('addGift', this.editedItem);
			}
			this.close();
		}
	}
	// components: {
	// 	vDataTable
	// }
}
</script>
