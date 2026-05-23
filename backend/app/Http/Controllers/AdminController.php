<?php

namespace App\Http\Controllers;

use App\Mail\MyEmail;
use Illuminate\Http\Request;
use App\Models\filieres;
use App\Models\Sujjet;
use App\Models\Etudiant;
use App\Models\Enseignement;
use App\Models\notes;
use App\Models\Salle;
use App\Models\Calendrier;
use App\Models\Classe;
use App\Models\nv_inscrire;
use App\Models\salle_diponible;
use App\Models\sujjets_filieres;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    // ===================== FILIERES =====================
    public function filieresIndex()
    {
        return filieres::with(['etudiants','enseignements','sujjets','classe'])->get();
    }

    public function filieresStore(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:100',
            'code' => 'required|string|max:20'
        ]);
        return filieres::create($data);
    }

    public function filieresShow(filieres $filiere)
    {
        return $filiere->load(['etudiants','enseignements','sujjets']);
    }

    public function filieresUpdate(Request $request, $id)
    {
        $data = $request->validate([
            'nom' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:20'
        ]);
        $filiere=filieres::find($id);
        $filiere->update($data);
        return $filiere;
    }

    public function filieresDestroy( $id)
    {   $filiere=filieres::find($id);
        $filiere->delete();
        return response()->noContent();
    }

    // ===================== SUJJETS =====================
    public function sujjetsIndex()
    {
        return Sujjet::with('filieres')->get();
    }

    public function sujjetsStore(Request $request, $id)
{
    $data = $request->validate([
        'matiere_nom' => 'required|string|max:100'
    ]);

    $filiere = filieres::findOrFail($id);

    $sujjet = Sujjet::create($data);

    // ⭐ BEST WAY
    $filiere->sujjets()->attach($sujjet->id);

    return response()->json([
        "message" => "Sujet ajouté avec succès",
        "data" => $sujjet
    ]);
}

    public function sujjetsShow(Sujjet $sujjet)
    {
        return $sujjet->load('filieres');
    }

    public function sujjetsUpdate(Request $request, $id)
    {
        $data = $request->validate([
            'matiere_nom' => 'sometimes|string|max:100'
        ]);
        $sujjet=Sujjet::find($id);
        $sujjet->update($data);
        return response()->noContent();
    }

    public function sujjetsDestroy($id)
{
    $sujjet = Sujjet::findOrFail($id);

    // delete pivot relations first
    sujjets_filieres::where('sujjets_id', $id)->delete();

    // delete subject
    $sujjet->delete();

    return response()->noContent();
}

    // ===================== ETUDIANTS =====================
    public function etudiantsIndex()
    {
        return Etudiant::with('filiere','notes.sujjet','classe')->get();
    }

    public function etudiantsStore(Request $request)
    {
        $validated = $request->validate([
        'prenom' => 'required|string|max:50',
        'nom' => 'required|string|max:50',
        'num_carte_parent' => 'required|string|max:20',
        'telephone' => 'required|string|max:20',
        'telephone_parent' => 'required|string|max:20',
        'id_filieres' => 'nullable|exists:filieres,id',
        'nom_parents' => 'required|string|max:50',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        
    ]);

    // Check if user already exists
    $user = User::where("email", $validated["email"])->first();

    if ($user) {
        return response()->json(["message" => "Email utilisé déjà"], 400);
    }

    // Create new user
    $user = User::create([
        'name' => $validated['nom'] . ' ' . $validated['prenom'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
        'role' => 'etudiant',
    ]);

    $u=user::where("email",$user["email"])->first();
        Etudiant::create([
        'nom' => $validated['nom'],
        'prenom' => $validated['prenom'],
        'nom_parents' => $validated['nom_parents'],
        'email' => $validated['email'],
        'num_carte_parent' => $validated['num_carte_parent'],
        'telephone' => $validated['telephone'],
        'telephone_parent' => $validated['telephone_parent'],
        'id_filieres' => $validated['id_filieres'] ,
        'id_user' => $u->id,
    ]);

    return response()->json(["message" => "Validé"], 201);
    }

    public function etudiantsShow(Etudiant $etudiant)
    {
        return $etudiant->load('filiere','notes.sujjet');
    }

    public function etudiantsUpdat(Request $request, $id)
{
    $etudiant = Etudiant::findOrFail($id);

    $validated = $request->validate([
        'prenom' => 'required|string|max:50',
        'nom' => 'required|string|max:50',
        'num_carte_parent' => 'required|string|max:20',
        'telephone' => 'required|string|max:20',
        'telephone_parent' => 'required|string|max:20',
        'id_filieres' => 'nullable|exists:filieres,id',
        'nom_parents' => 'required|string|max:50',
        'email' => 'required|email|unique:users,email,' . $etudiant->id_user,
        'password' => 'nullable|string|min:6',
    ]);

    
    $user = User::findOrFail($etudiant->id_user);

    $user->name = $validated['nom'] . ' ' . $validated['prenom'];
    $user->email = $validated['email'];

    
    if (!empty($validated['password'])) {
        $user->password = bcrypt($validated['password']);
    }

    $user->save();


    $etudiant->update([
        'nom' => $validated['nom'],
        'prenom' => $validated['prenom'],
        'nom_parents' => $validated['nom_parents'],
        'email' => $validated['email'],
        'num_carte_parent' => $validated['num_carte_parent'],
        'telephone' => $validated['telephone'],
        'telephone_parent' => $validated['telephone_parent'],
        'id_filieres' => $validated['id_filieres'],
    ]);

    return response()->json(["message" => "Modifié avec succès"], 200);
}

    public function etudiantsDestroy(Request $request)
    {
        $etudiant = Etudiant::find($request->id);

    if (!$etudiant) {
        return response()->json(["message" => "Enseignant introuvable"], 404);
    }

    // نجيب user المرتبط
    $user = User::find($etudiant->id_user);

    
    $etudiant->delete();

    // نحيد user إلا كان موجود
    if ($user) {
        $user->delete();
    }

    return response()->json(["message" => "Supprimé avec succès"]);
    }

    // ===================== ENSEIGNEMENTS =====================
    public function enseignementsIndex()
    {
        return Enseignement::with('filiere','sujjet',"user",'classe',"disponibilites")->get();
    }



public function enseignementsStore(Request $request)
{
    $validated = $request->validate([
        'nom_e' => 'required|string|max:50',
        'prenom_e' => 'required|string|max:50',
        'num_carte_national' => 'required|string|max:20',
        'telephone_e' => 'required|string|max:20',
        'id_filieres' => 'nullable|exists:filieres,id',
        'id_jujjets' => 'nullable|exists:sujjets,id',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
        
    ]);

    // Check if user already exists
    $user = User::where("email", $validated["email"])->first();

    if ($user) {
        return response()->json(["message" => "Email utilisé déjà"], 400);
    }

    // Create new user
    $user = User::create([
        'name' => $validated['nom_e'] . ' ' . $validated['prenom_e'],
        'email' => $validated['email'],
        'password' => bcrypt($validated['password']),
        'role' => 'enseignant',
    ]);

    $u=user::where("email",$user["email"])->first();
    Enseignement::create([
        'nom_e' => $validated['nom_e'],
        'prenom_e' => $validated['prenom_e'],
        'num_carte_national' => $validated['num_carte_national'],
        'telephone_e' => $validated['telephone_e'],
        'id_filieres' => $validated['id_filieres'] ,
        'id_jujjets' => $validated['id_jujjets'] ,
        'id_user' => $u->id,
        'total_hours' => 0,
    ]);

    return response()->json(["message" => "Validé"], 201);
}
 


    public function enseignementsShow(Enseignement $enseignement)
    {
        return $enseignement->load('filiere','sujjet');
    }

    public function enseignementsUpdate(Request $request, $id)
{
    $ense = Enseignement::find($id);

    if (!$ense) {
        return response()->json(["message" => "Introuvable"], 404);
    }

    $validated = $request->validate([
        'nom_e' => 'required|string|max:50',
        'prenom_e' => 'required|string|max:50',
        'num_carte_national' => 'required|string|max:20',
        'telephone_e' => 'required|string|max:20',
        'id_filieres' => 'nullable|exists:filieres,id',
        'id_jujjets' => 'nullable|exists:sujjets,id',
        'email' => 'required|email',
    ]);

    // update user مرتبط
    $user = User::find($ense->id_user);

    if ($user) {
        $user->update([
            'name' => $validated['nom_e'] . ' ' . $validated['prenom_e'],
            'email' => $validated['email'],
        ]);
    }

    // update enseignement
    $ense->update([
        'nom_e' => $validated['nom_e'],
        'prenom_e' => $validated['prenom_e'],
        'num_carte_national' => $validated['num_carte_national'],
        'telephone_e' => $validated['telephone_e'],
        'id_filieres' => $validated['id_filieres'],
        'id_jujjets' => $validated['id_jujjets'],
    ]);

    return response()->json(["message" => "Modifié avec succès"]);
}

    public function enseignementsDestroy(Request $request)
{
    $ense = Enseignement::find($request->id);

    if (!$ense) {
        return response()->json(["message" => "Enseignant introuvable"], 404);
    }

    // نجيب user المرتبط
    $user = User::find($ense->id_user);
    $ense->disponibilites()->delete();
    // نحيد enseignement
    $ense->delete();

    // نحيد user إلا كان موجود
    if ($user) {
        $user->delete();
    }

    return response()->json(["message" => "Supprimé avec succès"]);
}

    // ===================== NOTES =====================
    public function notesIndex()
    {
        return notes::with('etudiant','sujjet','filiere')->get();
    }

    public function notesStore(Request $request)
    {
        $data = $request->validate([
            'etudiant_id'=>'required|exists:etudiant,id',
            'sujjet_id'=>'required|exists:sujjets,id',
            'note'=>'required|numeric',
            'id_filieres'=>'required|exists:filieres,id',
            'cofficients'=>'nullable|integer'
        ]);
        return notes::create($data);
    }

    public function notesShow(notes $note)
    {
        return $note->load('etudiant','sujjet','filiere');
    }

    public function notesUpdate(Request $request, $id)
    {
        $user=notes::find($id);
        $data = $request->validate([
            'etudiant_id'=>'sometimes|exists:etudiant,id',
            'sujjet_id'=>'sometimes|exists:sujjets,id',
            'note'=>'sometimes|numeric',
            'id_filieres'=>'sometimes|exists:filieres,id',
            'cofficients'=>'sometimes|integer'
        ]);
        $user->update($data);
        return $user;
    }

    public function notesDestroy($id)
    {
        $user=notes::find($id);
        $user->delete();
        return response()->noContent();
    }

    // ===================== SALLES =====================
    public function sallesIndex()
    {
        return Salle::with('disponibilites')->get();
    }

    public function sallesStore(Request $request)
    {
        $data = $request->validate([
            'num_salle'=>'required|string|max:20'
        ]);
        return Salle::create($data);
    }

    public function sallesShow(Salle $salle)
    {
        return $salle->load('disponibilites','calendriers');
    }

    public function sallesUpdate(Request $request, Salle $salle)
    {
        $data = $request->validate([
            'num_salle'=>'sometimes|string|max:20'
        ]);
        $salle->update($data);
        return $salle;
    }

    public function sallesDestroy(Salle $salle)
    {
        $salle->delete();
        return response()->noContent();
    }

    // ===================== SALLE DISPONIBLE =====================
    public function sallesDisponiblesIndex()
    {
        return salle_diponible::with('salle',"filiere","sujjets","enseignement",'classe')->get();
    }

    public function sallesDisponiblesStore(Request $request)
{
    $data = $request->validate([
        'salle_id' => 'required|exists:salle,id',
        'jour' => 'required|date',
        'hour_debut' => 'required|date_format:H:i',
        'hour_fin' => 'required|date_format:H:i',
        'id_sujjets' => 'required|exists:sujjets,id',
        'id_enseignements' => 'required|exists:enseignements,id',
        'id_filiere' => 'required|exists:filieres,id',
        'id_classe' => 'required|exists:classe,id',
    ]);

    $data['disponible'] = 1;

    return salle_diponible::create($data);
}

    public function sallesDisponiblesShow(salle_diponible $salleDisponible)
    {
        return $salleDisponible->load('salle','calendriers');
    }

    public function sallesDisponiblesUpdate(Request $request, salle_diponible $salleDisponible)
    {
        $data = $request->validate([
            'salle_id'=>'sometimes|exists:salle,id',
            'jour'=>'sometimes|date',
            'hour_debut'=>'sometimes|date_format:H:i:s',
            'hour_fin'=>'sometimes|date_format:H:i:s',
            'disponible'=>'sometimes|boolean'
        ]);
        $salleDisponible->update($data);
        return $salleDisponible;
    }

    public function sallesDisponiblesDestroy($id)
    {
        $id=salle_diponible::find($id);
        $id->delete();
        return response()->json([
    'message' => 'Salle supprimée'
]);
    }

    // ===================== CALENDRIER =====================
    public function calendrierIndex()
    {
        return Calendrier::with('enseignant','sujjet','salle','salleDisponible')->get();
    }

    public function calendrierStore(Request $request)
    {
        $data = $request->validate([
            'id_enseignements'=>'required|exists:enseignements,id',
            'id_sujjets'=>'required|exists:sujjets,id',
            'id_salle'=>'required|exists:salle,id',
            'id_salle_diponible'=>'nullable|exists:salle_diponible,id'
        ]);
        return Calendrier::create($data);
    }

    public function calendrierShow(Calendrier $calendrier)
    {
        return $calendrier->load('enseignant','sujjet','salle','salleDisponible');
    }

    public function calendrierUpdate(Request $request, Calendrier $calendrier)
    {
        $data = $request->validate([
            'id_enseignements'=>'sometimes|exists:enseignements,id',
            'id_sujjets'=>'sometimes|exists:sujjets,id',
            'id_salle'=>'sometimes|exists:salle,id',
            'id_salle_diponible'=>'sometimes|exists:salle_diponible,id'
        ]);
        $calendrier->update($data);
        return $calendrier;
    }

    public function calendrierDestroy(Calendrier $calendrier)
    {
        $calendrier->delete();
        return response()->noContent();
    }

    // ===================== USERS =====================
    public function usersIndex(Request $request)
    {
        return User::all();
    }

  

  public function usersShow(Request $request)
{
    $user =User::where("email",$request->email)->first();

   if ($user && Hash::check($request->password, $user->password)) {
    return  response()->json($user);
    
    }
    elseif(!$user){
        return response()->json("em");
        }
    
    else {
        return response()->json("err");}

}
public function usersUpdate(Request $request)
{
    // validation
    $request->validate([
        'email' => 'required|email',
        'currentPassword' => 'required',
        'newPassword' => 'required|string|min:6',
    ]);

    // نجيب user بالإيميل
    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    
    if (!Hash::check($request->currentPassword, $user->password)) {
        return response()->json(['message' => 'Current password incorrect'], 401);
    }

    // تحديث password
    $user->update([
        'password' => Hash::make($request->newPassword),
    ]);

    return response()->json(['message' => 'Password updated successfully']);
}

    public function usersDestroy(User $user)
    {
        $user->delete();
        return response()->noContent();
    }
    public function neuveauinscrire_show()
    {
        $etudiant = nv_inscrire::with('filieres')->get();
        return $etudiant;
    }
  

public function neuveauinscrire_store(Request $request)
{
    $data1 = $request->validate([
        'prenom_i'=>'required|string|max:50',
        'nom_i'=>'required|string|max:50',
        'email'=>'required|email|unique:nv_inscrire,email',
        'num_tele'=>'required|string|max:20',
        'nom_parents'=>'required|string|max:100',
        'telephone_parent'=>'required|string|max:20',
        'id_filiere'=>'required|exists:filieres,id',
        'password' => 'required|string|min:6',
    ]);
    $data2 = [
        'name' => $data1["nom_i"] . " " . $data1["prenom_i"],
        'email' => $data1["email"],
        'password' => Hash::make($data1['password']), // securisé
        'role' => 'nv_etudiant'
    ];

    
    User::create($data2);
    return nv_inscrire::create($data1);
}
    

public function delete_neuveauinscrire(Request $request)
{
    $request->validate([
        'id' => 'required'
    ]);

    $nv_Inscrire = nv_inscrire::find($request->id);

    if (!$nv_Inscrire) {
        return response()->json([
            'message' => 'Element non trouvé'
        ], 404);
    }

    $nv_Inscrire->delete();

    return response()->json([
        'message' => 'Supprimé avec succès'
    ], 200);
}
    public function validation(Request $request){



    $etudiant = new Etudiant();

    $etudiant->prenom = $request->prenom_i;
    $etudiant->nom = $request->nom_i;
    $etudiant->email = $request->email;
    $etudiant->telephone = $request->num_tele;
    $etudiant->nom_parents = $request->nom_parents;
    $etudiant->telephone_parent = $request->telephone_parent;
    $etudiant->id_filieres =$request->id_filiere;

    $etudiant->save();

    return response()->json([
        'message' => 'Etudiant ajouté avec succès'
    ], 201);
}
    public function classeindex(){
        
        $classes = Classe::with(['etudiants', 'enseignements', 'sallesDisponibles','filiere'])->get();

        return response()->json($classes);
        
    } 
    public function classeStore(Request $request)
    {
        $validated = $request->validate([
            'nom_classe' => 'required|string|max:100',
            'id_filiere'=>'required|exists:filieres,id',
        ]);
        $classe = Classe::create($validated);
        return response()->json([
            'message' => 'Classe créée avec succès',
            'classe' => $classe
        ], 201);
    }
    public function updateClasseEtud(Request $request, $id)
{
    $etudiant = Etudiant::find($id);

    $validated = $request->validate([
        'id_classe' => 'required|integer|exists:classe,id'
    ]);

    $etudiant->update([
        'id_classe' => $validated['id_classe']
    ]);

    return response()->json([
        'message' => 'Classe updated successfully',
        'data' => $etudiant
    ]);
}
   public function retireretudiantclacc($id)
{
    $etudiant = Etudiant::find($id);


    $etudiant->update([
        'id_classe' => null
    ]);

    return response()->json([
        'message' => 'Classe updated successfully',
        'data' => $etudiant
    ]);
}
    public function classeDestroy($id)
{
    $classe = Classe::findOrFail($id);

    $classe->enseignements()->delete(); // حذف المرتبطين
    $classe->delete();

    return response()->noContent();
}
public function updateClasseEnse(Request $request, $id)
{
    $etudiant = Enseignement::find($id);
    $validated = $request->validate([
        'id_classe' => 'required|integer|exists:classe,id'
    ]);

    $etudiant->update([
        'id_classe' => $validated['id_classe']
    ]);

    return response()->json([
        'message' => 'Classe updated successfully',
        'data' => $etudiant
    ]);
}
public function retirerEnsegnClacc($id)
{
    $etudiant = Enseignement::find($id);
    $etudiant->update([
        'id_classe' => null
    ]);

    return response()->json([
        'message' => 'Classe updated successfully',
        'data' => $etudiant
    ]);
}
public function contact(Request $request)
    {
        // ✅ validation
        $request->validate([
            'name' => 'required',
            'subject' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'required|string',
            'message' => 'required|string',
        ]);

        
        Mail::to('soufyane.derkaoui@gmail.com')
            ->send(new MyEmail($request->all()));

        return response()->json([
            'status' => true,
            'message' => 'Message sent successfully'
        ]);
    }
}