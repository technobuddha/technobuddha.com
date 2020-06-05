<%@ Page Language="C#" MasterPageFile="~/Master/HeaderFooter.master" AutoEventWireup="true" CodeFile="CelebrityMatchup.aspx.cs" Inherits="Technobuddha.com.amusements.CelebrityMatchup" Title="Celebrity Matchup" %>
<asp:Content ID="Content1" ContentPlaceHolderID="mainPage" Runat="Server">
	<form id="form" runat="server">
		<table style="table-layout: fixed">
			<tr>
				<td class="celeb"/>
				<td class="celeb"/>
				<td class="celeb"/>
				<td class="celeb"/>
				<td class="celeb"/>
				<td class="celeb"/>
				<td class="celeb"/>
			</tr>
			<tr>
				<td colspan="7" style="text-align: left; ">
					Computers have been attempting to match up people's faces for years, with very little success.
					The folks at <a href="http://www.myheritage.com">My Heritige</a> have been so kind to
					provide internet users with hours of joy by allowing them to upload a picture, and match
					the face in the picture to various celebrities faces.
				</td>
			</tr>
			<tr>
				<td colspan="7" style="text-align: left; ">
					Test your skills at face matching, and see if you can perform as well (or as poorly) as the face
					matcher at My Heritage
				</td>
			</tr>
			<tr>
				<td id="round" colspan="7" style="text-align: center; padding-top: 8px; padding-bottom: 8px;">
					Press 'start' to begin the game
				</td>
			</tr>
			<tr>
				<td id="hint" colspan="7" style="text-align: center; padding-bottom: 8px;">
					&nbsp;
				</td>
			</tr>
			<tr>
				<td class="celeb"><asp:Image ID="img0" runat="server"/><br/><asp:Label ID="lbl0" runat="server"/></td>
				<td class="celeb"><asp:Image ID="img1" runat="server"/><br/><asp:Label ID="lbl1" runat="server"/></td>
				<td class="celeb"><asp:Image ID="img2" runat="server"/><br/><asp:Label ID="lbl2" runat="server"/></td>
				<td class="celeb"><asp:Image ID="img3" runat="server"/><br/><asp:Label ID="lbl3" runat="server"/></td>
				<td class="celeb"><asp:Image ID="img4" runat="server"/><br/><asp:Label ID="lbl4" runat="server"/></td>
				<td class="celeb"><asp:Image ID="img5" runat="server"/><br/><asp:Label ID="lbl5" runat="server"/></td>
				<td class="celeb"><asp:Image ID="img6" runat="server"/><br/><asp:Label ID="lbl6" runat="server"/></td>
			</tr>
			<tr>
				<td colspan="7" style="height: 16px">&nbsp;</td>
			</tr>
			<tr>
				<td colspan="7" style="text-align: center;">
					<button id="btnGuess" onclick="TryIt()">Start</button>
				</td>
			</tr>
			<tr>
				<td colspan="7" style="height: 16px">&nbsp;</td>
			</tr>
			<tr id='trGuess' >
				<td class='celeb'><div id='tdGuess0' style='display: none'><asp:Literal ID="c1" runat="server"/></div></td>
				<td class='celeb'><div id='tdGuess1' style='display: none'><asp:Literal ID="c2" runat="server"/></div></td>
				<td class='celeb'><div id='tdGuess2' style='display: none'><asp:Literal ID="c3" runat="server"/></div></td>
				<td class='celeb'><div id='tdGuess3' style='display: none'><asp:Literal ID="c4" runat="server"/></div></td>
				<td class='celeb'><div id='tdGuess4' style='display: none'><asp:Literal ID="c5" runat="server"/></div></td>
				<td class='celeb'><div id='tdGuess5' style='display: none'><asp:Literal ID="c6" runat="server"/></div></td>
				<td class='celeb'><div id='tdGuess6' style='display: none'><asp:Literal ID="c7" runat="server"/></div></td>
			</tr>
		</table>
	</form>
	<form id="frmScore" action="HighScore.aspx" method="post">
		<input type="hidden" id="hidScore" name="score"/>
	</form>
	
	<script type="text/javascript">
		function Guess(image, name, code)
		{
			this.image = image;
			this.name  = name;
			this.code  = code;
		}
		
		var ids		= [];
		<asp:Literal ID="scripter" runat="server"/>
		var round	= -1;
		var rounds	= 3;
		var	startTime;
		var finishTime;
		var guesses;
		var tokens  = [ '', '', '', '', '', '', '', '' ];
		
		function LoadPictures()
		{
			$('btnGuess').disabled = true;
			$('cs0').selectedIndex = 0; $('cs0').disabled = false;
			$('cs1').selectedIndex = 0; $('cs1').disabled = false;
			$('cs2').selectedIndex = 0; $('cs2').disabled = false;
			$('cs3').selectedIndex = 0; $('cs3').disabled = false;
			$('cs4').selectedIndex = 0; $('cs4').disabled = false;
			$('cs5').selectedIndex = 0; $('cs5').disabled = false;
			$('cs6').selectedIndex = 0; $('cs6').disabled = false;
			$('ci0').src = ids[0][round].image;
			$('ci1').src = ids[1][round].image;
			$('ci2').src = ids[2][round].image;
			$('ci3').src = ids[3][round].image;
			$('ci4').src = ids[4][round].image;
			$('ci5').src = ids[5][round].image;
			$('ci6').src = ids[6][round].image;
			$('cl0').innerHTML = ids[0][round].name;
			$('cl1').innerHTML = ids[1][round].name;
			$('cl2').innerHTML = ids[2][round].name;
			$('cl3').innerHTML = ids[3][round].name;
			$('cl4').innerHTML = ids[4][round].name;
			$('cl5').innerHTML = ids[5][round].name;
			$('cl6').innerHTML = ids[6][round].name;
			
			$('round').innerHTML = "Round " + (round + 1);
			$('hint').innerHTML  = "Select the name of the person who matches each celebrity";
			
			guesses = 0;
		}
		
		function CheckEm()
		{
			var votes = [ false, false, false, false, false, false, false ];
			
			$('btnGuess').disabled = true;
			for(var i = 0; i < 7; i++)
			{
				if($('cs' + i).selectedIndex == 0)
				{
					$('hint').innerHTML  = "Select the name of the person who matches each celebrity";
					return;
				}
					
				votes[$('cs' + i).selectedIndex - 1] = true;
			}
			
			for(var i = 0; i < 7; i++)
			{
				if(votes[i] == false)
				{
					$('hint').innerHTML  = "Select only one celebrity for each person";
					return;
				}
			}
			$('hint').innerHTML  = "Press 'guess' if you think your selections are correct";
			$('btnGuess').disabled = false;
		}
			
		function TryIt()
		{
			if(round == -1)
			{
				$('btnGuess').innerHTML = "Guess";
				round = 0;
				LoadPictures();
				
				//$('trGuess').style.display = 'inline';
				$('tdGuess0').style.display = 'block';
				$('tdGuess1').style.display = 'block';
				$('tdGuess2').style.display = 'block';
				$('tdGuess3').style.display = 'block';
				$('tdGuess4').style.display = 'block';
				$('tdGuess5').style.display = 'block';
				$('tdGuess6').style.display = 'block';
				
				startTime = new Date();
			}
			else
			{
				guesses++;
				
				var	correct = 0;
				for(var i = 0; i < 7; i++)
				{
					if($('cs' + i).value == ids[i][round].code)
					{
						$('cs' + i).disabled = true;
						correct++;
					}
				}
				
				if(correct == 7)
				{
					finishTime = new Date();
					
					AJAX.SOAP(
						{	url:		'http://www.technobuddha.com/services/scoring.asmx',
							action:		'Score',
							startTime:	startTime.getTime(),
							finishTime:	finishTime.getTime(),
							round:		round,
							guesses:	guesses,
							onSuccess:	processScore,
							onError:	function(req) { alert(req.responseText); }
						}
					);
					
					round++;
					startTime = finishTime;
					guesses   = 0;
					
					if(round < rounds) LoadPictures();
				}
			}
		}
			
		function processScore(ret)
		{
			var xround = Number(ret.responseSOAP("round").text);
			tokens[xround] = ret.responseSOAP().text;
				
			if(xround == (rounds-1))
			{
				AJAX.SOAP(
					{	url:		'http://www.technobuddha.com/services/scoring.asmx',
						action:		'HighScore',
						token0:		tokens[0],
						token1:		tokens[1],
						token2:		tokens[2],
						token3:		tokens[3],
						token4:		tokens[4],
						token5:		tokens[5],
						token6:		tokens[6],
						token7:		tokens[7],
						onSuccess:	highScore,
						onError:	function(req) { alert(req.responseText); }
					}
				);
			}
		}
			
		function highScore(ret)
		{
			$('hidScore').value = ret.responseSOAP().text;
			$('frmScore').submit();
		}
	</script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="tooltips" Runat="Server">
</asp:Content>

