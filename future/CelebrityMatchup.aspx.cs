using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using Technobuddha.security;
using System.Web.Configuration;
using Technobuddha.com;
using Technobuddha.library;
using System.Data.OleDb;
using System.Collections.Generic;

namespace Technobuddha.com.amusements
{
	public partial class CelebrityMatchup : System.Web.UI.Page
	{
		private	OleDbConnection conn;
		Random	rnd	= new Random();

		protected void Page_Load(object sender, EventArgs e)
		{
			Guess[,]		ids = null;
			List<Person>	people	= new List<Person>();

			conn = Database.OpenCelebrity();

				{
					OleDbCommand	cmd		= new OleDbCommand("SELECT id, name FROM person", conn);
					OleDbDataReader reader	= cmd.ExecuteReader();
					while(reader.Read())
					{

						Person person	= new Person();
						person.id		= reader.GetInt32(0);
						person.name		= reader.GetString(1);
						people.Add(person);
					}
					reader.Close();
				}

				for(int i = 0; i < people.Count; i++)
				{
					int	index		= rnd.Next(people.Count);
					Person	temp	= people[index];
					people[index]	= people[i];
					people[i]		= temp;
				}

				for(int i = 0; i < 7; i++)
				{
					for(int j = i+1; j < people.Count; j++)
					{
						if(people[i].name.ToLower() == people[j].name.ToLower())
						{
							people.RemoveAt(j);
							j--;
						}
					}
				}


 				img0.ImageUrl	= Image("person", people[0].id);
				img1.ImageUrl	= Image("person", people[1].id);
				img2.ImageUrl	= Image("person", people[2].id);
				img3.ImageUrl	= Image("person", people[3].id);
				img4.ImageUrl	= Image("person", people[4].id);
				img5.ImageUrl	= Image("person", people[5].id);
				img6.ImageUrl	= Image("person", people[6].id);
				lbl0.Text		= people[0].name;
				lbl1.Text		= people[1].name;
 				lbl2.Text		= people[2].name;
				lbl3.Text		= people[3].name;
				lbl4.Text		= people[4].name;
				lbl5.Text		= people[5].name;
				lbl6.Text		= people[6].name;

				ids = new Guess[7, 8];

				for(int i = 0 ; i < 7; i++)
				{
					OleDbCommand cmd = new OleDbCommand("SELECT id, name FROM celebrity WHERE person = " + Escape.Sql(people[i].id), conn);
					OleDbDataReader	reader = cmd.ExecuteReader();

					int j = 0;
					while(reader.Read())
					{
						Guess guess = new Guess();
						guess.person	= people[i].id;
						guess.celebrity = reader.GetInt32(0);
						guess.name		= reader.GetString(1);
						ids[i, j] = guess;
						j++;
					}

					if(j != 8)
						throw new Exception("Row " + i.ToString());
					reader.Close();
				}

				for(int i = 0; i < 7; i++)
				{
					for(int j = 0; j < 8; j++)
					{
						int k = rnd.Next(8);
						Guess guess = ids[i, k];
						ids[i, k] = ids[i, j];
						ids[i, j] = guess;
					}
				}

				for(int j = 0; j < 8; j++)
				{
					for(int i = 0; i < 7; i++)
					{
						int k = rnd.Next(7);
						Guess guess = ids[k, j];
						ids[k, j] = ids[i, j];
						ids[i, j] = guess;
					}
				}


			if(ids != null)
			{
				string sel = "<option/>" +
							 "<option value='" + people[0].id.ToString() + "'>" + people[0].name + "</option>"	+
							 "<option value='" + people[1].id.ToString() + "'>" + people[1].name + "</option>"	+
							 "<option value='" + people[2].id.ToString() + "'>" + people[2].name + "</option>"	+
							 "<option value='" + people[3].id.ToString() + "'>" + people[3].name + "</option>"	+
							 "<option value='" + people[4].id.ToString() + "'>" + people[4].name + "</option>"	+
							 "<option value='" + people[5].id.ToString() + "'>" + people[5].name + "</option>"	+
							 "<option value='" + people[6].id .ToString()+ "'>" + people[6].name + "</option>"	+
							 "</select>";


				c1.Text = "<select id='cs0' onchange='CheckEm()'>" + sel + "<br/><img id='ci0' style='width: 59px; height:79px;'/><br/><span id='cl0'></span><br/>";
				c2.Text = "<select id='cs1' onchange='CheckEm()'>" + sel + "<br/><img id='ci1' style='width: 59px; height:79px;'/><br/><span id='cl1'></span><br/>";
				c3.Text = "<select id='cs2' onchange='CheckEm()'>" + sel + "<br/><img id='ci2' style='width: 59px; height:79px;'/><br/><span id='cl2'></span><br/>";
				c4.Text = "<select id='cs3' onchange='CheckEm()'>" + sel + "<br/><img id='ci3' style='width: 59px; height:79px;'/><br/><span id='cl3'></span><br/>";
				c5.Text = "<select id='cs4' onchange='CheckEm()'>" + sel + "<br/><img id='ci4' style='width: 59px; height:79px;'/><br/><span id='cl4'></span><br/>";
				c6.Text = "<select id='cs5' onchange='CheckEm()'>" + sel + "<br/><img id='ci5' style='width: 59px; height:79px;'/><br/><span id='cl5'></span><br/>";
				c7.Text = "<select id='cs6' onchange='CheckEm()'>" + sel + "<br/><img id='ci6' style='width: 59px; height:79px;'/><br/><span id='cl6'></span><br/>";
			}

			string script = string.Empty;

			for(int i = 0; i < 7; i++)
			{
				script += "ids[" + i.ToString() + "] = [];";
				for(int j = 0; j < 3; j++)
				{
					script += "ids[";
					script += Escape.JS(i);
					script += "][";
					script += Escape.JS(j);
					script += "] = new Guess(";
					script += Escape.JS(Image("celebrity", ids[i, j].celebrity));
					script += ",";
					script += Escape.JS(ids[i, j].name);
					script += ",";
					script += Escape.JS(ids[i, j].person);
					script += ");";
				}
			}

			scripter.Text = script;

			//for(int j = 0; j < 8; j++)
			//{
			//    HtmlTableRow row = new HtmlTableRow();
			//    for(int i = 0; i < 7; i++)
			//    {
			//        HtmlTableCell cell = new HtmlTableCell();
			//        cell.InnerHtml = "<img src='" + Image("celebrity", ids[i, j].celebrity) + "'/>";
			//        row.Cells.Add(cell);
			//    }
			//    tbl.Rows.Add(row);
			//}
		}

		private string Image(string type, int id)
		{
			string	enc			= type + "," + id.ToString();
			string	password	= WebConfigurationManager.AppSettings.Get("password");
			string	salt		= WebConfigurationManager.AppSettings.Get("salt");
	   
			return "/images/Celebrity.ashx?i=" + Escape.URI(Encryptor.Encrypt(enc, password, Convert.FromBase64String(salt)));
		}

		private string PersonName(int id)
		{
			OleDbCommand cmd = new OleDbCommand("SELECT name FROM person WHERE id = " + Escape.Sql(id), conn);
			return (string)cmd.ExecuteScalar();
		}
	}

	class Guess
	{
		public	int		celebrity;
		public	int		person;
		public	string	name;
	}

	class Person
	{
		public	int		id;
		public	string	name;
	}
}
